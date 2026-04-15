const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;  // Utiliser la clé secrète depuis les variables d'environnement

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Accès refusé. Token manquant." });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ error: "Token invalide ou expiré." });
        req.user = decoded; // Contient id et role
        next();
    });
};