const express = require('express');
const router = express.Router();
const db = require('../db'); 
const authenticateToken = require('./middleware/auth'); // Import sécurité
const authorizeRoles = require('./middleware/role');   // Import rôles

// --- ROUTES CRUD CHAUFFEUR ---

// 1. CREATE : Ajouter un chauffeur (Administrateur uniquement)
router.post('/', authenticateToken, authorizeRoles('Administrateur'), async (req, res) => {
	try {
		const { nom_chauffeur, telephone_chauffeur } = req.body;

		const [result] = await db.query(
			'INSERT INTO Chauffeur (nom_chauffeur, telephone_chauffeur) VALUES (?, ?)',
			[nom_chauffeur, telephone_chauffeur]
		);

		res.status(201).json({ 
            id_chauffeur: result.insertId, 
            message: 'Chauffeur ajouté avec succès !' 
        });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Erreur lors de la création du chauffeur' });
	}
});

// 2. READ : Lister tous les chauffeurs (Administrateur et Secretaire)
router.get('/', authenticateToken, authorizeRoles('Administrateur', 'Secretaire'), async (req, res) => {
	try {
		const [rows] = await db.query('SELECT * FROM Chauffeur');
		res.json(rows);
	} catch (err) {
		console.error('Erreur GET /chauffeur:', err);
		res.status(500).json({ error: err.message });
	}
});

// 2b. READ : Voir un seul chauffeur par ID (Administrateur et Secretaire)
router.get('/:id_chauffeur', authenticateToken, authorizeRoles('Administrateur', 'Secretaire'), async (req, res) => {
	try {
		const [rows] = await db.query(
            'SELECT * FROM Chauffeur WHERE id_chauffeur = ?', 
            [req.params.id_chauffeur]
        );
        
		if (rows.length === 0) {
            return res.status(404).json({ message: 'Chauffeur non trouvé' });
        }
		res.json(rows[0]);
	} catch (err) {
		console.error('Erreur GET /chauffeur/:id_chauffeur:', err);
		res.status(500).json({ error: err.message });
	}
});

// 3. UPDATE : Modifier un chauffeur (Administrateur uniquement)
router.put('/:id_chauffeur', authenticateToken, authorizeRoles('Administrateur'), async (req, res) => {
	try {
		const { nom_chauffeur, telephone_chauffeur } = req.body;
		const { id_chauffeur } = req.params;

		const [result] = await db.query(
			'UPDATE Chauffeur SET nom_chauffeur = ?, telephone_chauffeur = ? WHERE id_chauffeur = ?',
			[nom_chauffeur, telephone_chauffeur, id_chauffeur]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Chauffeur non trouvé' });
		}

		res.json({ message: 'Chauffeur mis à jour avec succès' });
	} catch (err) {
		console.error('Erreur PUT /chauffeur/:id_chauffeur:', err);
		res.status(500).json({ error: err.message });
	}
});

// 4. DELETE : Supprimer un chauffeur (Administrateur uniquement)
router.delete('/:id_chauffeur', authenticateToken, authorizeRoles('Administrateur'), async (req, res) => {
	try {
		const [result] = await db.query(
            'DELETE FROM Chauffeur WHERE id_chauffeur = ?', 
            [req.params.id_chauffeur]
        );

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Chauffeur non trouvé' });
		}

		res.json({ message: 'Chauffeur supprimé définitivement' });
	} catch (err) {
		console.error('Erreur DELETE /chauffeur/:id_chauffeur:', err);
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;