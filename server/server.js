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

// --- LOGICA PERCORSI ASSOLUTI ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definiamo il percorso verso la cartella assets del client
const assetsPath = path.resolve(__dirname, '../client/public/assets');

const app = express();

// --- CONFIGURAZIONE CORS ---
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Payload limits per video pesanti
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// --- DEBUG LOG ALL'AVVIO ---
console.log('--- MELAVERDE SYSTEM CHECK ---');
console.log('📂 Root Server Dir:', __dirname);
console.log('🖼️  Gallery Assets:', path.join(assetsPath, 'gallery'));
console.log('✅ Assets Dir Exists?', fs.existsSync(assetsPath) ? 'YES' : 'NO');
console.log('------------------------------');

// --- OPZIONI PER FILE STATICI (Sostituisce il define che crashava) ---
const staticOptions = {
    setHeaders: (res, filePath) => {
        // Sblocca caricamento cross-origin
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
        res.set('Access-Control-Allow-Origin', 'http://localhost:5173');
        res.set('Cache-Control', 'public, max-age=3600');

        // Forza MIME types per Linux se l'estensione corrisponde
        if (filePath.endsWith('.webm')) {
            res.set('Content-Type', 'video/webm');
        }
        if (filePath.endsWith('.webp')) {
            res.set('Content-Type', 'image/webp');
        }
    }
};

// Servizio file statici con le nuove opzioni
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
    res.status(500).json({ error: 'Internal system error during media processing' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`
    ===========================================
    🍏 MELAVERDE BACKEND ONLINE
    📡 PORT: ${PORT} | http://localhost:${PORT}
    🎥 VIDEO SUPPORT: WebM (FFmpeg)
    📸 IMAGE SUPPORT: WebP (ImageMagick)
    ===========================================
    `);
});