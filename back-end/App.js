// 1. Charger les variables d'environnement dès le début (Indispensable pour le JWT)
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');

// Importation des routes
const busRoutes = require('./routes/bus');
const chauffeurRoutes = require('./routes/chauffeur');
const trajetRoutes = require('./routes/trajet');
const voyageRoutes = require('./routes/voyage');
const utilisateurRoutes = require('./routes/utilisateur');
const reservationRoutes = require('./routes/reservation');
const authRoutes = require("./routes/auth.routes"); // Route pour Login/Register
const paymentIntentRoutes = require('./routes/create-payment-intent'); 
const statsRoutes = require('./routes/stats');



const app = express();
const port = 3000;

// Middlewares globaux
app.use(cors());
app.use(express.json());

// --- CONFIGURATION DES ROUTES ---

// Route d'authentification (C'est ici que Login.jsx va taper)
app.use('/auth', authRoutes); 

app.use('/bus', busRoutes);

// Ajouter la route des statistiques
app.use('/stats', statsRoutes);

// Chauffeurs (Supporte le singulier et le pluriel pour éviter les erreurs 404 du front)
app.use('/chauffeur', chauffeurRoutes);
app.use('/chauffeurs', chauffeurRoutes);

app.use('/trajets', trajetRoutes);
app.use('/voyages', voyageRoutes);
app.use('/utilisateurs', utilisateurRoutes);
app.use('/reservations', reservationRoutes);

// Route pour les paiements Stripe
app.use('/create-payment-intent', paymentIntentRoutes);

// Simple health check route (Pour vérifier que le serveur tourne)
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: Date.now(), message: "Serveur Backend opérationnel" });
});

// --- GESTION DES ERREURS GLOBALES ---
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

app.get("/", (req, res) => {
  res.send("API OK + MYSQL CONNECTED");
});
app.get("/test-db", async (req, res) => {
    const [result] = await pool.query("SELECT 1");
    res.json(result);
});
// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running");

});