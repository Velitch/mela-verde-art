import express from 'express';
// Import per la gestione degli eventi (CRUD)
import {
    createEvent,
    getAllEvents,
    deleteEvent,
    updateEvent
} from '../controllers/eventController.js';

// Import per le statistiche (Analytics)
import {
    incrementEventView,
    getStats
} from '../controllers/statsController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multerConfig.js';

const router = express.Router();

/* ============================================================
   ROTTE PUBBLICHE
   ============================================================ */

// Recupera la lista eventi per il frontend
router.get('/', getAllEvents);

// Tracciamento visualizzazione (chiamata da EventCard.jsx)
// Non protetta da authMiddleware per permettere il conteggio dei visitatori
router.post('/:id/view', incrementEventView);


/* ============================================================
   ROTTE PROTETTE (Richiedono Token Admin)
   ============================================================ */

// Recupero dati aggregati per StatsView.jsx nella Dashboard
router.get('/admin/stats', authMiddleware, getStats);

// Creazione nuovo evento con upload immagine (WebP auto-conversion)
router.post('/', authMiddleware, upload.single('image'), createEvent);

// Eliminazione definitiva evento e relativo file immagine
router.delete('/:id', authMiddleware, deleteEvent);

// Modifica evento esistente (gestisce anche la sostituzione immagine)
router.put('/:id', authMiddleware, upload.single('image'), updateEvent);

export default router;