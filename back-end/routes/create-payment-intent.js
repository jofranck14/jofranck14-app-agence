const express = require('express');
const router = express.Router();
// Remplace par ta clé secrète Stripe (sk_test_...)
const stripe = process.env.STRIPE_SECRET_KEY;
router.post('/', async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ error: "Montant manquant" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Le montant envoyé par React (déjà en centimes)
            currency: 'eur',
            automatic_payment_methods: { enabled: true },
        });

        // On renvoie le clientSecret au frontend
        res.json({ clientSecret: paymentIntent.client_secret });
        
    } catch (error) {
        console.error("Erreur Stripe:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;



