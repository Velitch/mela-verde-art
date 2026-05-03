import express from 'express';
import mysql from 'mysql2/promise'; // Usiamo la versione promise per un codice più moderno
import cors from 'cors';
import dotenv from 'dotenv';

// Configurazione ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configurazione Pool di connessione a MariaDB
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// --- ROTTE API ---

// 1. Test di connessione
app.get('/api/health', (req, res) => {
    res.json({ status: "ok", message: "Server Mela Verde è attivo" });
});

// 2. Recupera tutti gli eventi (Timeline)
app.get('/api/events', async (req, res) => {
    try {
        // Ordiniamo per data: i futuri per primi o in ordine cronologico
        const [rows] = await db.query('SELECT * FROM events ORDER BY date ASC');
        res.json(rows);
    } catch (error) {
        console.error("Errore query MariaDB:", error);
        res.status(500).json({ error: "Errore nel recupero degli eventi" });
    }
});

// 3. Recupera un singolo evento per dettagli (opzionale)
app.get('/api/events/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM events WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: "Evento non trovato" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Errore nel recupero dell'evento" });
    }
});

// Avvio Server
app.listen(PORT, () => {
    console.log(`
🚀 BACKEND PRONTO
📡 URL: http://localhost:${PORT}
📂 Database: ${process.env.DB_NAME}
    `);
});