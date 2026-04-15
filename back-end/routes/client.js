const express = require('express');
const router = express.Router();
const db = require('../db'); // Import de la configuration de la base de données

// --- ROUTES CRUD CLIENT ---

// 1. CREATE : Enregistrer un nouveau client
router.post('/', async (req, res) => {
	try {
		const { 
            nom_client, 
            prenom_client, 
            email, 
            telephone_client, 
            mot_passe, 
            id_secretaire, 
            login_utilisateur 
        } = req.body;

		const [result] = await db.query(
			`INSERT INTO Client (nom_client, prenom_client, email, telephone_client, mot_passe, id_secretaire, login_utilisateur) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[nom_client, prenom_client, email, telephone_client, mot_passe, id_secretaire, login_utilisateur]
		);

		res.status(201).json({ 
            id_client: result.insertId, 
            message: 'Client enregistré avec succès !' 
        });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Erreur lors de la création du compte client' });
	}
});

// 2. READ : Lister tous les clients (avec le nom de la secrétaire qui l'a enregistré)
router.get('/', async (req, res) => {
	try {
		const [rows] = await db.query(`
            SELECT c.*, s.nom_secretaire 
            FROM Client c
            LEFT JOIN Secretaire s ON c.id_secretaire = s.id_secretaire
        `);
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// 2b. READ : Voir un client spécifique par ID
router.get('/:id_client', async (req, res) => {
	try {
		const [rows] = await db.query(
            'SELECT * FROM Client WHERE id_client = ?', 
            [req.params.id_client]
        );
        
		if (rows.length === 0) {
            return res.status(404).json({ message: 'Client non trouvé' });
        }
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// 3. UPDATE : Modifier les informations d'un client
router.put('/:id_client', async (req, res) => {
	try {
		const { 
            nom_client, 
            prenom_client, 
            email, 
            telephone_client, 
            mot_passe, 
            id_secretaire, 
            login_utilisateur 
        } = req.body;
		const { id_client } = req.params;

		const [result] = await db.query(
			`UPDATE Client SET 
                nom_client = ?, 
                prenom_client = ?, 
                email = ?, 
                telephone_client = ?, 
                mot_passe = ?, 
                id_secretaire = ?, 
                login_utilisateur = ? 
             WHERE id_client = ?`,
			[nom_client, prenom_client, email, telephone_client, mot_passe, id_secretaire, login_utilisateur, id_client]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Client non trouvé' });
		}

		res.json({ message: 'Informations client mises à jour' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// 4. DELETE : Supprimer un compte client
router.delete('/:id_client', async (req, res) => {
	try {
		const [result] = await db.query(
            'DELETE FROM Client WHERE id_client = ?', 
            [req.params.id_client]
        );

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Client non trouvé' });
		}

		res.json({ message: 'Compte client supprimé définitivement' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;