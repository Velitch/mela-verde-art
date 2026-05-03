import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import galleryRoutes from './routes/gallery.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Su Render, la cartella assets potrebbe non essere accessibile se fuori dalla root del server.
// Assicurati che le immagini siano caricate su GitHub nella cartella client/public/assets
const assetsPath = path.resolve(__dirname, '../client/public/assets');

const app = express();

// --- CONFIGURAZIONE CORS DINAMICA ---
const allowedOrigins = [
    'https://mela-verde-art.vercel.app',
    'http://localhost:5173'
];

app.use(cors({
    origin: function (origin, callback) {
        // Permette richieste senza origin (come mobile apps o curl) o da origini autorizzate
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.includes('vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// --- DEBUG LOG ALL'AVVIO ---
console.log('--- MELAVERDE SYSTEM CHECK ---');
console.log('📂 Root Server Dir:', __dirname);
console.log('🖼️  Assets Path:', assetsPath);
console.log('✅ Assets Dir Exists?', fs.existsSync(assetsPath) ? 'YES' : 'NO');
console.log('------------------------------');

// --- OPZIONI PER FILE STATICI ---
const staticOptions = {
    setHeaders: (res, filePath) => {
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
        // Rimosso il localhost fisso qui, ora usa il valore dinamico
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Cache-Control', 'public, max-age=3600');

        if (filePath.endsWith('.webm')) res.set('Content-Type', 'video/webm');
        if (filePath.endsWith('.webp')) res.set('Content-Type', 'image/webp');
    }
};

app.use('/assets', express.static(assetsPath, staticOptions));

// --- LOGGING RICHIESTE ---
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// --- ROTTE API ---
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);

app.post('/api/test-login', (req, res) => {
    res.json({ message: "System online - Communication successful" });
});

// Gestione 404
app.use((req, res) => {
    res.status(404).json({ message: `Rotta non trovata: ${req.method} ${req.url}` });
});

// Gestione Errori Globale
app.use((err, req, res, next) => {
    console.error('🔥 SERVER_CRITICAL_ERROR:', err.stack);
    res.status(500).json({ error: 'Internal system error' });
});

// IMPORTANTE: Render assegna la porta automaticamente tramite process.env.PORT
const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    ===========================================
    🍏 MELAVERDE BACKEND ONLINE
    📡 PORT: ${PORT}
    🏠 ORIGINS: ${allowedOrigins.join(', ')}
    ===========================================
    `);
});