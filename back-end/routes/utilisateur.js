const express = require('express');
const router = express.Router();
const db = require('../db'); // Import de la configuration de la base de données
const bcrypt = require('bcrypt'); // npm install bcrypt
const jwt = require('jsonwebtoken');
const SECRET_KEY = "ton_code_secret_tres_long"; // À mettre idéalement dans un fichier .env

// --- ROUTES CRUD UTILISATEUR ---

// 1. CREATE : Enregistrer un nouvel utilisateur
router.post('/', async (req, res) => {
    try {
        console.log('[DEBUG] POST /utilisateurs body:', req.body);
        const { nom, prenom, email, telephone, login, mot_de_passe, role } = req.body;

        // Basic validation
        if (!nom || !prenom || !email || !login || !mot_de_passe) {
            return res.status(400).json({ error: 'Champs requis manquants' });
        }
        // Normalize telephone: allow optional leading + and up to 15 digits
        let telRaw = String(telephone || '').trim();
        let telNorm = '';
        if (telRaw.startsWith('+')) {
            telNorm = '+' + telRaw.slice(1).replace(/\D/g, '').slice(0, 15);
        } else {
            telNorm = telRaw.replace(/\D/g, '').slice(0, 15);
        }
        if (!/^\+?\d{5,15}$/.test(telNorm)) return res.status(400).json({ error: 'Telephone invalide (doit être 5-15 chiffres, optionnel +)' });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({ error: 'Email invalide' });
        if (mot_de_passe.length < 6) return res.status(400).json({ error: 'Mot de passe trop court (>=6)' });

        // Check unique login
        const [[existing]] = await db.query('SELECT id_utilisateur FROM Utilisateur WHERE login = ?', [login]);
        if (existing) return res.status(409).json({ error: 'Login déjà utilisé' });

        // Hachage du mot de passe pour la sécurité
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(mot_de_passe, saltRounds);
        console.log('[DEBUG] Normalized telephone for insert:', telNorm);

        const [result] = await db.query(
            `INSERT INTO Utilisateur (nom, prenom, email, telephone, login, mot_de_passe, role) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [nom, prenom, email, telNorm, login, hashedPassword, role]
        );

        res.status(201).json({ 
            id_utilisateur: result.insertId, 
            message: 'Utilisateur créé avec succès !' 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
    }
});

// 2. READ : Lister tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        // On ne sélectionne pas le mot_de_passe par sécurité dans la liste
        const [rows] = await db.query('SELECT id_utilisateur, nom, prenom, email, telephone, login, role FROM Utilisateur');
        console.log('[DEBUG] GET /utilisateurs rows count:', rows.length);
        // Log few entries to inspect telephone field
        if (rows.length > 0) console.log('[DEBUG] sample user telephone:', rows[0].telephone);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2b. READ : Voir un utilisateur spécifique par ID
router.get('/:id_utilisateur', async (req, res) => {
    try {
        console.log('[DEBUG] GET /utilisateurs/:id body params:', req.params);
        const [rows] = await db.query(
            'SELECT id_utilisateur, nom, prenom, email, telephone, login, role FROM Utilisateur WHERE id_utilisateur = ?', 
            [req.params.id_utilisateur]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. UPDATE : Modifier les informations d'un utilisateur
router.put('/:id_utilisateur', async (req, res) => {
    try {
        console.log('[DEBUG] PUT /utilisateurs/:id body:', req.body);
        const { nom, prenom, email, telephone, login, mot_de_passe, role } = req.body;
        const { id_utilisateur } = req.params;

        // Basic validation (similar to create)
        if (!nom || !prenom || !email || !login) {
            return res.status(400).json({ error: 'Champs requis manquants' });
        }
        // Normalize telephone and validate
        let telRawU = String(telephone || '').trim();
        let telNormU = '';
        if (telRawU.startsWith('+')) {
            telNormU = '+' + telRawU.slice(1).replace(/\D/g, '').slice(0, 15);
        } else {
            telNormU = telRawU.replace(/\D/g, '').slice(0, 15);
        }
        if (!/^\+?\d{5,15}$/.test(telNormU)) return res.status(400).json({ error: 'Telephone invalide (doit être 5-15 chiffres, optionnel +)' });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({ error: 'Email invalide' });

        // Check unique login (exclude current user)
        const [rowsLogin] = await db.query('SELECT id_utilisateur FROM Utilisateur WHERE login = ? AND id_utilisateur != ?', [login, id_utilisateur]);
        if (rowsLogin.length > 0) return res.status(409).json({ error: 'Login déjà utilisé par un autre utilisateur' });

        // Si un nouveau mot de passe est fourni, on le hache
        let query = `UPDATE Utilisateur SET nom = ?, prenom = ?, email = ?, telephone = ?, login = ?, role = ?`;
        let params = [nom, prenom, email, telNormU, login, role];
        console.log('[DEBUG] Normalized telephone for update:', telNormU);

        if (mot_de_passe) {
            const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
            query += `, mot_de_passe = ?`;
            params.push(hashedPassword);
        }

        query += ` WHERE id_utilisateur = ?`;
        params.push(id_utilisateur);

        const [result] = await db.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json({ message: 'Informations utilisateur mises à jour' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. DELETE : Supprimer un utilisateur
router.delete('/:id_utilisateur', async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM Utilisateur WHERE id_utilisateur = ?', 
            [req.params.id_utilisateur]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.json({ message: 'Utilisateur supprimé définitivement' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }



    
// 5. LOGIN : Authentifier un utilisateur et générer un token JWT

router.post('/login', async (req, res) => {
    try {
        const { login, mot_de_passe } = req.body;

        // 1. Chercher l'utilisateur
        const [rows] = await db.query('SELECT * FROM Utilisateur WHERE login = ?', [login]);
        if (rows.length === 0) return res.status(401).json({ error: "Identifiants incorrects" });

        const user = rows[0];

        // 2. Vérifier le mot de passe
        const validPassword = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!validPassword) return res.status(401).json({ error: "Identifiants incorrects" });

        // 3. Générer le Token JWT (valable 24h)
        const token = jwt.sign(
            { id: user.id_utilisateur, role: user.role },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        // 4. Réponse
        res.json({
            token,
            user: {
                id: user.id_utilisateur,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

});

module.exports = router;