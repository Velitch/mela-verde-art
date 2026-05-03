import multer from 'multer';
import path from 'path';
import fs from 'fs';

const tempDir = 'temp_uploads/';
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        // Manteniamo il nome originale che arriva dal frontend (che abbiamo già formattato)
        // Aggiungiamo un timestamp per sicurezza assoluta
        const timestamp = Date.now();
        const cleanName = file.originalname.replace(/\s+/g, '_');
        cb(null, `${timestamp}_${cleanName}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // Alziamo a 100MB per i video
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|mp4|mov|quicktime|webm/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Formato asset non supportato (Solo immagini o video)"));
    }
});

export default upload;