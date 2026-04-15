const express = require('express');
const router = express.Router();
const db = require('../db'); // Import de la configuration de la base de données

// --- ROUTES CRUD RESERVATION ---

// 1. CREATE : Effectuer une nouvelle réservation
router.post('/', async (req, res) => {
	try {
		let { date_reservation, statut, nombres_places, id_utilisateur, id_voyage, nom, prenom, email, telephone } = req.body;

		// Basic validations
		if (!date_reservation || !id_voyage) return res.status(400).json({ error: 'Date et voyage requis' });
		// Ensure nombres_places is a positive integer
		nombres_places = Number(nombres_places) || 1;
		if (nombres_places < 1) return res.status(400).json({ error: 'Nombre de places invalide' });

		// Validate voyage exists
		const [vrows] = await db.query('SELECT id_voyage FROM Voyage WHERE id_voyage = ?', [id_voyage]);
		if (vrows.length === 0) return res.status(400).json({ error: 'Voyage introuvable' });

		// If no user id provided, try to find by email or telephone, otherwise create a new utilisateur
		let userId = id_utilisateur;
		if (!userId) {
			if (!email && !telephone) return res.status(400).json({ error: 'Email ou téléphone requis pour créer un client' });
			const [found] = await db.query('SELECT id_utilisateur FROM Utilisateur WHERE email = ? OR telephone = ? LIMIT 1', [email || '', telephone || '']);
			if (found.length > 0) {
				userId = found[0].id_utilisateur;
			} else {
				// create a minimal utilisateur record
				const baseLogin = `${(prenom || 'user').toLowerCase()}.${(nom || 'guest').toLowerCase()}`.replace(/\s+/g, '');
				let login = baseLogin;
				let suffix = 1;
				// ensure login unique
				while (true) {
					const [[exists]] = await db.query('SELECT id_utilisateur FROM Utilisateur WHERE login = ?', [login]);
					if (!exists) break;
					login = `${baseLogin}${suffix++}`;
				}
				// generate random password
				const pw = Math.random().toString(36).slice(-8);
				const bcrypt = require('bcrypt');
				const hashed = await bcrypt.hash(pw, 10);
				const [ruser] = await db.query('INSERT INTO Utilisateur (nom, prenom, email, telephone, login, mot_de_passe, role) VALUES (?, ?, ?, ?, ?, ?, ?)', [nom || '', prenom || '', email || null, telephone || null, login, hashed, 'Client']);
				userId = ruser.insertId;
			}
		}

		const [result] = await db.query(
			`INSERT INTO Reservation (date_reservation, statut, nombres_places, id_utilisateur, id_voyage) 
	             VALUES (?, ?, ?, ?, ?)`,
			[date_reservation, statut || 'En attente', nombres_places, userId, id_voyage]
		);

		res.status(201).json({ 
			id_reservation: result.insertId, 
			message: 'Réservation enregistrée avec succès !',
			id_utilisateur: userId
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Erreur lors de la création de la réservation' });
	}
});

// 2. READ : Lister toutes les réservations avec les détails du utilisateur et du voyage
router.get('/', async (req, res) => {
	try {
		// Jointure complexe pour avoir une vue complète (utilisateur + Voyage + Trajet)
		const [rows] = await db.query(`
				SELECT r.*, u.nom as nom, u.prenom as prenom, v.heure_depart, v.prix, t.lieu_depart, t.lieu_arrive
				FROM Reservation r
				JOIN Utilisateur u ON r.id_utilisateur = u.id_utilisateur
				JOIN Voyage v ON r.id_voyage = v.id_voyage
				JOIN Trajet t ON v.id_trajet = t.id_trajet
				ORDER BY r.date_reservation DESC
        `);
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// 2b. READ : Voir une réservation spécifique par ID
router.get('/:id_reservation', async (req, res) => {
	try {
		const [rows] = await db.query(
            'SELECT * FROM Reservation WHERE id_reservation = ?', 
            [req.params.id_reservation]
        );
        
		if (rows.length === 0) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// 3. UPDATE : Modifier une réservation (ex: changer le nombre de places ou le statut)
router.put('/:id_reservation', async (req, res) => {
	try {
		const { date_reservation, statut, nombres_places, id_utilisateur, id_voyage } = req.body;
		const { id_reservation } = req.params;

		const [result] = await db.query(
			`UPDATE Reservation SET 
                date_reservation = ?, 
                statut = ?, 
                nombres_places = ?, 
                id_utilisateur = ?, 
                id_voyage = ? 
             WHERE id_reservation = ?`,
			[date_reservation, statut, nombres_places, id_utilisateur, id_voyage, id_reservation]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Réservation non trouvée' });
		}

		res.json({ message: 'Réservation mise à jour avec succès' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// 4. DELETE : Annuler/Supprimer une réservation
router.delete('/:id_reservation', async (req, res) => {
	try {
		const [result] = await db.query(
            'DELETE FROM Reservation WHERE id_reservation = ?', 
            [req.params.id_reservation]
        );

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Réservation non trouvée' });
		}

		res.json({ message: 'Réservation supprimée définitivement' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// --- PARTIE AJUSTÉE POUR L'HISTORIQUE ---

// Rechercher les réservations par l'email de l'utilisateur
router.get('/utilisateur/:email', async (req, res) => {
    const emailUser = req.params.email;
    
    // Requête SQL ajustée : 
    // 1. On utilise le chemin /utilisateur/:email pour correspondre au frontend
    // 2. On fait les jointures avec Utilisateur, Voyage et Trajet pour avoir les noms et les lieux
    const sql = `
        SELECT r.*, u.nom, u.prenom, v.heure_depart, v.prix, t.lieu_depart, t.lieu_arrive
        FROM Reservation r
        JOIN Utilisateur u ON r.id_utilisateur = u.id_utilisateur
        JOIN Voyage v ON r.id_voyage = v.id_voyage
        JOIN Trajet t ON v.id_trajet = t.id_trajet
        WHERE u.email = ?
        ORDER BY r.date_reservation DESC
    `;

    try {
        const [results] = await db.query(sql, [emailUser]);
        res.json(results);
    } catch (err) {
        console.error("Erreur historique:", err);
        res.status(500).json({ error: "Erreur lors de la récupération de l'historique" });
    }
});

module.exports = router;