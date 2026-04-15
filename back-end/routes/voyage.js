const express = require('express');
const router = express.Router();
const db = require('../db'); // Import de la configuration de la base de données

// --- ROUTES CRUD VOYAGE ---

// 1. CREATE : Programmer un nouveau voyage
router.post('/', async (req, res) => {
	try {
		let { heure_depart, jour, type, prix, id_trajet } = req.body;

		// Normalize heure_depart to TIME string 'HH:MM:SS' if needed
		let heure = null;
		if (heure_depart) {
			if (typeof heure_depart === 'number' || /^\d+$/.test(String(heure_depart))) {
				const num = Number(heure_depart);
				const ms = num > 1e12 ? Math.floor(num / 1000) * 1000 : num * 1000; // seconds->ms or ms
				const dt = new Date(ms);
				const hh = String(dt.getHours()).padStart(2, '0');
				const mm = String(dt.getMinutes()).padStart(2, '0');
				const ss = String(dt.getSeconds()).padStart(2, '0');
				heure = `${hh}:${mm}:${ss}`;
			} else if (/^\d{2}:\d{2}(:\d{2})?$/.test(String(heure_depart))) {
				// ensure seconds exist
				heure = String(heure_depart).length === 5 ? `${heure_depart}:00` : String(heure_depart);
			} else {
				// Not a recognized time format
				return res.status(400).json({ message: 'Format heure_depart invalide (attendu HH:MM ou HH:MM:SS)' });
			}
		}

			// Validate jour if provided
			const allowed = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
			if (jour) {
				const j = String(jour).trim().toLowerCase();
				if (!allowed.includes(j)) return res.status(400).json({ message: 'Jour invalide, choisir Lundi → Dimanche' });
				// Normalize to capitalized
				jour = j.charAt(0).toUpperCase() + j.slice(1);
			}

			const [result] = await db.query(
				'INSERT INTO Voyage (heure_depart, jour, type, prix, id_trajet) VALUES (?, ?, ?, ?, ?)',
				[heure, jour || null, type, prix, id_trajet]
			);

		res.status(201).json({ 
            id_voyage: result.insertId, 
            message: 'Voyage programmé avec succès !' 
        });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Erreur lors de la création du voyage' });
	}
});

// 2. READ : Lister tous les voyages (avec les détails du trajet correspondant)
router.get('/', async (req, res) => {
	try {
		// On effectue une jointure pour afficher le lieu de départ et d'arrivée au lieu de juste l'ID
		const [rows] = await db.query(`
			SELECT v.*, t.lieu_depart, t.lieu_arrive 
			FROM Voyage v
			JOIN Trajet t ON v.id_trajet = t.id_trajet
            ORDER BY v.heure_depart ASC
		`);
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// 2b. READ : Voir un seul voyage par son ID
router.get('/:id_voyage', async (req, res) => {
	try {
		const [rows] = await db.query(
            'SELECT * FROM Voyage WHERE id_voyage = ?', 
            [req.params.id_voyage]
        );
        
		if (rows.length === 0) {
            return res.status(404).json({ message: 'Voyage non trouvé' });
        }
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// 3. UPDATE : Modifier les informations d'un voyage
router.put('/:id_voyage', async (req, res) => {
	try {
		let { heure_depart, jour, type, prix, id_trajet } = req.body;
		const { id_voyage } = req.params;

		console.log('PUT /voyages/' + id_voyage + ' body:', req.body);

			// Normalize heure_depart to TIME string
			let heure = null;
			if (heure_depart) {
				if (typeof heure_depart === 'number' || /^\d+$/.test(String(heure_depart))) {
					const num = Number(heure_depart);
					const ms = num > 1e12 ? Math.floor(num / 1000) * 1000 : num * 1000;
					const dt = new Date(ms);
					const hh = String(dt.getHours()).padStart(2, '0');
					const mm = String(dt.getMinutes()).padStart(2, '0');
					const ss = String(dt.getSeconds()).padStart(2, '0');
					heure = `${hh}:${mm}:${ss}`;
				} else if (/^\d{2}:\d{2}(:\d{2})?$/.test(String(heure_depart))) {
					heure = String(heure_depart).length === 5 ? `${heure_depart}:00` : String(heure_depart);
				} else {
					return res.status(400).json({ message: 'Format heure_depart invalide (attendu HH:MM ou HH:MM:SS)' });
				}
			}

			// Validate jour if provided
			const allowed = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
			if (jour) {
				const j = String(jour).trim().toLowerCase();
				if (!allowed.includes(j)) return res.status(400).json({ message: 'Jour invalide, choisir Lundi → Dimanche' });
				jour = j.charAt(0).toUpperCase() + j.slice(1);
			}

			const [result] = await db.query(
				'UPDATE Voyage SET heure_depart = ?, jour = ?, type = ?, prix = ?, id_trajet = ? WHERE id_voyage = ?',
				[heure, jour || null, type, prix, id_trajet, id_voyage]
			);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Voyage non trouvé' });
		}

		res.json({ message: 'Voyage mis à jour avec succès' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// 4. DELETE : Annuler/Supprimer un voyage
router.delete('/:id_voyage', async (req, res) => {
	try {
		const [result] = await db.query(
            'DELETE FROM Voyage WHERE id_voyage = ?', 
            [req.params.id_voyage]
        );

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Voyage non trouvé' });
		}

		res.json({ message: 'Voyage supprimé définitivement' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;