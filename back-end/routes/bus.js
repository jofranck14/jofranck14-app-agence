const express = require('express');
const router = express.Router();
const db = require('../db'); // Importez votre configuration de base de données



// --- ROUTES CRUD ---

// 1. CREATE : Ajouter un bus
router.post('/', async (req, res) => {
	try {
		const { immatriculation, modele, capacite, statut } = req.body;
		// Basic server-side validation to avoid DB errors
		if (!immatriculation || !String(immatriculation).trim()) return res.status(400).json({ error: 'Immatriculation requise' });
		if (!modele || !String(modele).trim()) return res.status(400).json({ error: 'Modèle requis' });
		const cap = Number(capacite);
		if (Number.isNaN(cap) || cap < 1) return res.status(400).json({ error: 'Capacité invalide' });
		const finalStatut = statut || 'disponible';
		console.log('POST /bus payload:', { immatriculation, modele, capacite: cap, statut: finalStatut });

			const [result] = await db.query(
			'INSERT INTO bus (immatriculation, modele, capacite, statut) VALUES (?, ?, ?, ?)',
			[immatriculation, modele, capacite, finalStatut]
		);

			res.status(201).json({ id: result.insertId, message: 'Bus ajouté avec succès !' });
	} catch (err) {
		console.error('Erreur POST /bus:', err);
		res.status(500).json({ error: err.message || 'Erreur lors de la création du bus' });
	}
});

// 2. READ : Lister tous les bus
router.get('/', async (req, res) => {
	try {
		const { statut } = req.query;
		let sql = 'SELECT * FROM bus';
		let params = [];

		if (statut) {
			sql += ' WHERE statut = ?';
			params.push(statut);
		}

		const [rows] = await db.query(sql, params);
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// 2b. READ : Voir un seul bus par ID
router.get('/:id_bus', async (req, res) => {
	try {
		const [rows] = await db.query('SELECT * FROM bus WHERE id_bus = ?', [req.params.id_bus]);
		if (!rows || rows.length === 0) return res.status(404).json({ message: 'Bus non trouvé' });
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// 3. UPDATE : Modifier toutes les informations d'un bus
router.put('/:id_bus', async (req, res) => {
	try {
		const { immatriculation, modele, capacite, statut } = req.body;

		const [result] = await db.query(
			'UPDATE bus SET immatriculation = ?, modele = ?, capacite = ?, statut = ? WHERE id_bus = ?',
			[immatriculation, modele, capacite, statut, req.params.id_bus]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Bus non trouvé' });
		}

		res.json({ message: 'Bus mis à jour avec succès' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// 4. DELETE : Supprimer un bus
router.delete('/:id_bus', async (req, res) => {
	try {
		const [result] = await db.query('DELETE FROM bus WHERE id_bus = ?', [req.params.id_bus]);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Bus non trouvé' });
		}

		res.json({ message: 'Bus supprimé définitivement' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router; // N'oubliez pas d'exporter le router