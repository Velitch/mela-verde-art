import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import galleryRoutes from './routes/gallery.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- CONFIGURAZIONE CORS ---
// Permettiamo tutto per ora per eliminare ogni dubbio, poi lo stringeremo
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// --- LOGGING RICHIESTE (Per vedere cosa succede nei log di Render) ---
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// --- ROTTE API ---
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);

// Rotta di test per verificare se il server risponde
app.get('/api/health', (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});

// Gestione 404
app.use((req, res) => {
    console.log(`⚠️ 404 su: ${req.url}`);
    res.status(404).json({ message: `Rotta non trovata: ${req.method} ${req.url}` });
});

// --- GESTIONE ERRORI GLOBALE (Fondamentale per il debug dell'errore 500) ---
app.use((err, req, res, next) => {
    console.error('🔥 SERVER_ERROR:', err.message);
    console.error('📚 STACK:', err.stack);
    res.status(500).json({
        error: 'Internal server error',
        details: err.message
    });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    ===========================================
    🍏 MELAVERDE BACKEND ONLINE
    📡 PORT: ${PORT}
    🚀 DATABASE: ${process.env.DATABASE_URL ? 'URL Presente' : 'URL MANCANTE!'}
    ===========================================
    `);
});