const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/dashboard-counts', async (req, res) => {
    console.log("--- Calcul des statistiques en cours ---");

    // Fonction de secours pour éviter le crash si une table manque
    const getCount = async (sql) => {
        try {
            // mysql2/promise renvoie [rows, fields]
            const [rows] = await db.query(sql);
            return rows[0].total || 0;
        } catch (err) {
            console.error(`❌ Erreur sur la requête [${sql}] :`, err.message);
            return 0; // On renvoie 0 mais on ne crash pas le serveur
        }
    };

    try {
        // Exécution des comptes un par un (Singulier + Majuscules)
        const busCount = await getCount("SELECT COUNT(*) as total FROM bus");
        const trajetCount = await getCount("SELECT COUNT(*) as total FROM trajet");
        const voyageCount = await getCount("SELECT COUNT(*) as total FROM voyage");
        const reservationCount = await getCount("SELECT COUNT(*) as total FROM reservation");
        const chauffeurCount = await getCount("SELECT COUNT(*) as total FROM chauffeur");
        const utilisateurCount = await getCount("SELECT COUNT(*) as total FROM utilisateur");
        
        // Filtres sur les rôles (Majuscules)
        const clientCount = await getCount("SELECT COUNT(*) as total FROM utilisateur WHERE role = 'Client'");
        const secretaireCount = await getCount("SELECT COUNT(*) as total FROM utilisateur WHERE role = 'Secretaire'");

        const stats = {
            bus: busCount,
            trajets: trajetCount,
            voyages: voyageCount,
            reservations: reservationCount,
            chauffeurs: chauffeurCount,
            utilisateurs: utilisateurCount,
            clients: clientCount,
            secretaires: secretaireCount
        };

        console.log("✅ Statistiques prêtes :", stats);
        res.json(stats);

    } catch (error) {
        console.error("💥 Erreur critique :", error.message);
        res.status(500).json({ error: "Erreur serveur interne" });
    }
});

module.exports = router;