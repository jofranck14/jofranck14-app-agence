// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Fonction query simplifiée
const query = async (sql, params) => {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (error) {
        throw error;
    }
};

// Test connexion au démarrage
pool.getConnection()
    .then(connection => {
        console.log('✅ Connecté à MySQL (Railway)');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Erreur connexion DB:', err.message);
    });

// Export
module.exports = pool;
module.exports.query = query;