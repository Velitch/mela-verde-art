import db from '../config/db.js';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);
const getGalleryPath = () => path.resolve(process.cwd(), '../client/public/assets/gallery');

export const uploadPhotos = async (req, res) => {
    if (!req.files || req.files.length === 0) return res.status(400).json({ message: "Nessun file caricato" });

    const { vibe, alt_text } = req.body;
    const targetDir = getGalleryPath();
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

    try {
        const uploadPromises = req.files.map(async (file) => {
            const timestamp = Date.now() + Math.floor(Math.random() * 1000);
            const originalPath = file.path;
            const fileExt = path.extname(file.originalname).toLowerCase();
            const isVideo = ['.mp4', '.mov', '.avi', '.quicktime'].includes(fileExt);

            // Definiamo il nome finale basato sul tipo
            const finalExt = isVideo ? '.webm' : '.webp';
            const finalName = `${vibe}_melaverde_bodypaint_${timestamp}${finalExt}`;
            const destinationPath = path.join(targetDir, finalName);
            const assetType = isVideo ? 'video' : 'image';

            if (isVideo) {
                // --- LOGICA VIDEO (FFMPEG) ---
                // Convertiamo in WebM (vp9) per massima leggerezza e qualità SEO
                await execPromise(`ffmpeg -i "${originalPath}" -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus "${destinationPath}"`);
            } else {
                // --- LOGICA IMMAGINE (IMAGEMAGICK) ---
                // Il tuo mogrify rinomina, quindi lo gestiamo con cautela
                await execPromise(`convert "${originalPath}" -resize 1600x -quality 80 "${destinationPath}"`);
            }

            // Pulizia file temporaneo originale
            if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);

            // Database Insert con TYPE e ALT_TEXT
            const image_url = `/assets/gallery/${finalName}`;
            await db.execute(
                'INSERT INTO gallery (image_url, vibe, type, alt_text) VALUES (?, ?, ?, ?)',
                [image_url, vibe, assetType, alt_text || '']
            );
        });

        await Promise.all(uploadPromises);
        res.status(201).json({ message: "Assets elaborati, rinominati e convertiti!" });
    } catch (err) {
        console.error("Errore processamento asset:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getGallery = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM gallery ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) { res.status(500).json(err); }
};

export const deletePhoto = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute('SELECT image_url FROM gallery WHERE id = ?', [id]);
        if (rows.length > 0) {
            const fullPath = path.join(process.cwd(), '../client/public', rows[0].image_url);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        }
        await db.execute('DELETE FROM gallery WHERE id = ?', [id]);
        res.json({ message: "Asset rimosso correttamente" });
    } catch (err) { res.status(500).json(err); }
};