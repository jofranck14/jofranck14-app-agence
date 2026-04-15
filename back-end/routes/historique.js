

// Rechercher les réservations par l'email du client
router.get('/utilisateur/:email', async (req, res) => {
    const emailClient = req.params.email;
    
    // Requête SQL pour récupérer les réservations + les infos du voyage lié
    const sql = `
        SELECT r.*, v.lieu_depart, v.lieu_arrive, v.heure_depart, v.prix 
        FROM reservations r
        JOIN voyages v ON r.id_voyage = v.id_voyage
        WHERE r.email = ?
        ORDER BY r.date_reservation DESC
    `;

    try {
        // Utilisation de ton objet de connexion à la base de données
        const [results] = await db.execute(sql, [emailClient]);
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur lors de la récupération des données" });
    }
});