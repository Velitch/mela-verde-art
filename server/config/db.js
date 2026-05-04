import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306, // È sempre meglio specificare la porta
    waitForConnections: true,
    connectionLimit: 5,               // Ridotto a 5 per il piano DEV di Clever Cloud
    queueLimit: 0,
    enableKeepAlive: true,            // Mantiene la connessione sveglia
    keepAliveInitialDelay: 10000
});

// Test della connessione all'avvio (utile per i log di Render)
pool.getConnection()
    .then(connection => {
        console.log('✅ Connessione a Clever Cloud (MariaDB) riuscita!');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Errore di connessione al DB:', err.message);
    });

export default pool;