import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import galleryRoutes from './routes/gallery.js';

dotenv.config();

const app = express();

// CORS super-permessivo per il debug
app.use(cors());
app.use(express.json());

// Log di ogni singola richiesta
app.use((req, res, next) => {
    console.log(`[CHECK] Richiesta ricevuta: ${req.method} ${req.url}`);
    next();
});

// Rotta di salute ultra-semplice (senza database)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "alive", message: "Server backend funzionante" });
});

// Rotte API
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);

// Gestione errori migliorata per vedere cosa succede
app.use((err, req, res, next) => {
    console.error('❌ ERRORE SERVER:', err.message);
    res.status(500).json({ error: "Errore interno", message: err.message });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server in ascolto sulla porta ${PORT}`);
    if (!process.env.DATABASE_URL) {
        console.error("⚠️ ATTENZIONE: DATABASE_URL non configurata!");
    }
});