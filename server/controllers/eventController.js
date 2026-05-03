import db from '../config/db.js';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Helper per ottenere il percorso assoluto della cartella assets
const getAssetsPath = () => path.resolve(process.cwd(), '../client/public/assets/events');

// --- RECUPERO TUTTI GLI EVENTI ---
export const getAllEvents = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM events ORDER BY date DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// --- CREAZIONE EVENTO ---
export const createEvent = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Immagine obbligatoria" });

    const {
        name, customFileName, date, endDate, location, vibe,
        description, organizer, performer, external_link
    } = req.body;

    const slug = customFileName
        ? customFileName.toLowerCase().replace(/[^a-z0-9]/g, '-')
        : name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const finalWebPName = `${slug}.webp`;
    const targetDir = getAssetsPath();
    const originalPath = req.file.path;
    const destinationPath = path.join(targetDir, finalWebPName);

    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    try {
        // Conversione
        await execPromise(`mogrify -format webp -resize 1200x -quality 82 "${originalPath}"`);

        const tempWebPPath = originalPath.replace(path.extname(originalPath), '.webp');
        if (fs.existsSync(tempWebPPath)) {
            fs.renameSync(tempWebPPath, destinationPath);
        }

        if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);

        const image_url = `/assets/events/${finalWebPName}`;
        const query = `
            INSERT INTO events (
                name, date, endDate, location, vibe, 
                description, organizer, performer, image_url, 
                external_link, eventStatus
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        `;

        await db.execute(query, [
            name, date, endDate || null, location, vibe,
            description, organizer || 'Melaverde', performer,
            image_url, external_link
        ]);

        res.status(201).json({ message: "Evento pubblicato con successo!" });
    } catch (err) {
        console.error("Errore creazione:", err);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: err.message });
    }
};

// --- ELIMINA EVENTO ---
export const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute('SELECT image_url FROM events WHERE id = ?', [id]);
        if (rows.length > 0) {
            const imagePath = path.join(process.cwd(), '../client/public', rows[0].image_url);
            if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }
        await db.execute('DELETE FROM events WHERE id = ?', [id]);
        res.json({ message: "Evento eliminato con successo" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const {
        name, date, endDate, location, vibe,
        description, organizer, performer, external_link, eventStatus
    } = req.body;

    // --- FIX DATE: Rimuoviamo il timestamp ISO per il database ---
    const cleanDate = date ? date.split('T')[0] : null;
    const cleanEndDate = endDate ? endDate.split('T')[0] : null;

    let image_url = req.body.image_url;

    try {
        if (req.file) {
            // ... (logica immagine rimane uguale) ...
        }

        const query = `
            UPDATE events 
            SET name=?, date=?, endDate=?, location=?, vibe=?, 
                description=?, organizer=?, performer=?, external_link=?, 
                eventStatus=?, image_url=?
            WHERE id=?
        `;

        const values = [
            name,
            cleanDate,      // <--- USIAMO LA DATA PULITA
            cleanEndDate,   // <--- USIAMO LA DATA PULITA
            location,
            vibe,
            description,
            organizer,
            performer,
            external_link,
            eventStatus,
            image_url,
            id
        ];

        await db.execute(query, values);
        res.json({ message: "Sincronizzazione completata!", image_url });
    } catch (err) {
        console.error("Errore update:", err);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ error: err.message });
    }
};