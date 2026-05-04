import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import galleryRoutes from './routes/gallery.js';

dotenv.config();

const app = express();

// --- CONFIGURAZIONE CORS AGGIORNATA ---
const allowedOrigins = [
    'https://mela-verde-art.vercel.app',
    'https://melaverdeart.it',        // Il tuo nuovo dominio
    'https://www.melaverdeart.it',    // Versione con www
    'http://localhost:5173'           // Per i tuoi test locali
];

app.use(cors({
    origin: function (origin, callback) {
        // Permette richieste senza origin (come postman) o da domini autorizzati
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS blocked: Origin not allowed'));
        }
    },
    credentials: true, // Necessario se userai sessioni o cookie
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Log di debug
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin || 'N/A'}`);
    next();
});

// Rotta di salute
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "alive", message: "Melaverde Backend is Online" });
});

// Rotte API
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);

// Gestione 404
app.use((req, res) => {
    res.status(404).json({ message: "Rotta non trovata" });
});

// Gestione errori
app.use((err, req, res, next) => {
    console.error('❌ ERRORE SERVER:', err.message);
    res.status(500).json({ error: "Errore interno", message: err.message });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    ===========================================
    🍏 MELAVERDE BACKEND ONLINE
    📡 PORT: ${PORT}
    🌐 DOMINIO: melaverdeart.it
    ===========================================
    `);
});