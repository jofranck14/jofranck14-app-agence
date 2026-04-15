const express = require('express');
const router = express.Router();
const db = require('../db'); // Import de la configuration de la base de données

// --- ROUTES CRUD TRAJET ---

// 1. CREATE : Ajouter un trajet
router.post('/', async (req, res) => {
	try {
		const { lieu_depart, lieu_arrive, distance, id_bus, id_chauffeur } = req.body;

		const [result] = await db.query(
			'INSERT INTO Trajet (lieu_depart, lieu_arrive, distance, id_bus, id_chauffeur) VALUES (?, ?, ?, ?, ?)',
			[lieu_depart, lieu_arrive, distance, id_bus, id_chauffeur]
		);

		res.status(201).json({ 
            id_trajet: result.insertId, 
            message: 'Trajet créé et affecté avec succès !' 
        });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Erreur lors de la création du trajet' });
	}
});

// 2. READ : Lister tous les trajets (avec les infos du bus et du chauffeur en option)
router.get('/', async (req, res) => {
	try {
		// Version simple :
		// const [rows] = await db.query('SELECT * FROM Trajet');
		
		/* 
		   Version améliorée (Jointure) pour voir le modèle du bus et le nom du chauffeur :
           	*/
		  const [rows] = await db.query(`
			  SELECT t.*, b.modele as bus_modele, b.immatriculation as immatriculation, c.nom_chauffeur as chauffeur_nom, c.telephone_chauffeur
			  FROM Trajet t
			  LEFT JOIN Bus b ON t.id_bus = b.id_bus
			  LEFT JOIN Chauffeur c ON t.id_chauffeur = c.id_chauffeur
			 `);
	
		
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// 2b. READ : Voir un seul trajet par ID
router.get('/:id_trajet', async (req, res) => {
	try {
		const [rows] = await db.query(
			`SELECT t.*, b.immatriculation as immatriculation, b.modele as bus_modele, c.nom_chauffeur as chauffeur_nom, c.telephone_chauffeur
			 FROM Trajet t
			 LEFT JOIN Bus b ON t.id_bus = b.id_bus
			 LEFT JOIN Chauffeur c ON t.id_chauffeur = c.id_chauffeur
			 WHERE t.id_trajet = ?`,
			[req.params.id_trajet]
		);
        
		if (rows.length === 0) {
            return res.status(404).json({ message: 'Trajet non trouvé' });
        }
		res.json(rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// 3. UPDATE : Modifier un trajet
router.put('/:id_trajet', async (req, res) => {
	try {
		const { lieu_depart, lieu_arrive, distance, id_bus, id_chauffeur } = req.body;
		const { id_trajet } = req.params;

		const [result] = await db.query(
			'UPDATE Trajet SET lieu_depart = ?, lieu_arrive = ?, distance = ?, id_bus = ?, id_chauffeur = ? WHERE id_trajet = ?',
			[lieu_depart, lieu_arrive, distance, id_bus, id_chauffeur, id_trajet]
		);

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Trajet non trouvé' });
		}

		res.json({ message: 'Trajet mis à jour avec succès' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// 4. DELETE : Supprimer un trajet
router.delete('/:id_trajet', async (req, res) => {
	try {
		const [result] = await db.query(
            'DELETE FROM Trajet WHERE id_trajet = ?', 
            [req.params.id_trajet]
        );

		if (result.affectedRows === 0) {
			return res.status(404).json({ message: 'Trajet non trouvé' });
		}

		res.json({ message: 'Trajet supprimé définitivement' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;