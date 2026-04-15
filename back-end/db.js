// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gestiontransport',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Avec mysql2/promise, pool.query renvoie déjà une promesse.
// On simplifie donc la fonction query.
const query = async (sql, params) => {
    try {
        // [rows, fields] est la structure de retour standard de mysql2/promise
        const [results] = await pool.execute(sql, params); 
        return results;
    } catch (error) {
        throw error;
    }
};

// Vérification de la connexion au démarrage (syntaxe Promise)
pool.getConnection()
    .then(connection => {
        console.log('✅ Connecté à MySQL via le pool de connexions');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Erreur de connexion à la base de données:', err.message);
    });

// On exporte directement le pool (recommandé) ou la fonction query
module.exports = pool;