const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db"); // Vérifie que le chemin vers db.js est bon

const SECRET_KEY = process.env.JWT_SECRET || "ma_cle_test";

// LA ROUTE DE LOGIN
router.post("/login", async (req, res) => {
    try {
        const { login, mot_de_passe } = req.body;
        
        // 1. Chercher l'utilisateur dans la table "Utilisateur"
        const [rows] = await db.query("SELECT * FROM Utilisateur WHERE login = ?", [login]);
        
        if (rows.length === 0) {
            return res.status(401).json({ error: "Identifiants incorrects (User non trouvé)" });
        }

        const user = rows[0];

        // 2. Vérifier le mot de passe avec bcrypt
        const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!isMatch) {
            return res.status(401).json({ error: "Identifiants incorrects (Password faux)" });
        }

        // 3. Créer le Token JWT
        const token = jwt.sign(
            { id: user.id_utilisateur, role: user.role },
            SECRET_KEY,
            { expiresIn: "24h" }
        );

        // 4. Envoyer la réponse
        res.json({ 
            token, 
            user: { id: user.id_utilisateur, nom: user.nom, role: user.role } 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

module.exports = router;