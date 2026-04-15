module.exports = (...rolesAutorises) => {
    return (req, res, next) => {
        if (!req.user || !rolesAutorises.includes(req.user.role)) {
            return res.status(403).json({ error: "Accès interdit : vous n'avez pas les droits nécessaires." });
        }
        next();
    };
};