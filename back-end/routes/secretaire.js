// const express = require('express');
// const router = express.Router();
// const db = require('../db'); // Import de la configuration de la base de données

// // --- ROUTES CRUD SECRETAIRE ---

// // 1. CREATE : Ajouter un(e) secrétaire
// router.post('/', async (req, res) => {
// 	try {
// 		const { 
//             nom_secretaire, 
//             prenom_secretaire, 
//             email, 
//             telephone_secretaire, 
//             mot_passe, 
//             role, 
//             login_utilisateur 
//         } = req.body;

// 		const [result] = await db.query(
// 			`INSERT INTO Secretaire (nom_secretaire, prenom_secretaire, email, telephone_secretaire, mot_passe, role, login_utilisateur) 
//              VALUES (?, ?, ?, ?, ?, ?, ?)`,
// 			[nom_secretaire, prenom_secretaire, email, telephone_secretaire, mot_passe, role, login_utilisateur]
// 		);

// 		res.status(201).json({ 
//             id_secretaire: result.insertId, 
//             message: 'Secrétaire enregistré(e) avec succès !' 
//         });
// 	} catch (err) {
// 		console.error(err);
// 		res.status(500).json({ error: 'Erreur lors de la création du profil secrétaire' });
// 	}
// });

// // 2. READ : Lister tous/toutes les secrétaires
// router.get('/', async (req, res) => {
// 	try {
// 		const [rows] = await db.query('SELECT * FROM Secretaire');
// 		res.json(rows);
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 	}
// });

// // 2b. READ : Voir un seul profil par ID
// router.get('/:id_secretaire', async (req, res) => {
// 	try {
// 		const [rows] = await db.query(
//             'SELECT * FROM Secretaire WHERE id_secretaire = ?', 
//             [req.params.id_secretaire]
//         );
        
// 		if (rows.length === 0) {
//             return res.status(404).json({ message: 'Secrétaire non trouvé(e)' });
//         }
// 		res.json(rows[0]);
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 	}
// });

// // 3. UPDATE : Modifier les informations d'un(e) secrétaire
// router.put('/:id_secretaire', async (req, res) => {
// 	try {
// 		const { 
//             nom_secretaire, 
//             prenom_secretaire, 
//             email, 
//             telephone_secretaire, 
//             mot_passe, 
//             role, 
//             login_utilisateur 
//         } = req.body;
// 		const { id_secretaire } = req.params;

// 		const [result] = await db.query(
// 			`UPDATE Secretaire SET 
//                 nom_secretaire = ?, 
//                 prenom_secretaire = ?, 
//                 email = ?, 
//                 telephone_secretaire = ?, 
//                 mot_passe = ?, 
//                 role = ?, 
//                 login_utilisateur = ? 
//              WHERE id_secretaire = ?`,
// 			[nom_secretaire, prenom_secretaire, email, telephone_secretaire, mot_passe, role, login_utilisateur, id_secretaire]
// 		);

// 		if (result.affectedRows === 0) {
// 			return res.status(404).json({ message: 'Secrétaire non trouvé(e)' });
// 		}

// 		res.json({ message: 'Profil mis à jour avec succès' });
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 	}
// });

// // 4. DELETE : Supprimer un(e) secrétaire
// router.delete('/:id_secretaire', async (req, res) => {
// 	try {
// 		const [result] = await db.query(
//             'DELETE FROM Secretaire WHERE id_secretaire = ?', 
//             [req.params.id_secretaire]
//         );

// 		if (result.affectedRows === 0) {
// 			return res.status(404).json({ message: 'Secrétaire non trouvé(e)' });
// 		}

// 		res.json({ message: 'Compte secrétaire supprimé' });
// 	} catch (err) {
// 		res.status(500).json({ error: err.message });
// 	}
// });

// module.exports = router;