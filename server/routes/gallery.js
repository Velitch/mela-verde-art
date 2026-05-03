import express from 'express';
import { uploadPhotos, getGallery, deletePhoto } from '../controllers/galleryController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multerConfig.js';

const router = express.Router();

/**
 * @route   GET /api/gallery
 * @desc    Recupera l'archivio multimediale (Immagini e Video)
 * @access  Pubblico
 */
router.get('/', getGallery);

/**
 * @route   POST /api/gallery/upload
 * @desc    Upload ibrido (Immagini/Video). 
 * Converte in WebP/WebM, rinomina fisicamente e genera ALT SEO.
 * @access  Protetta (Admin)
 */
// Il limite di 10 file è gestito qui per sicurezza lato server
router.post(
    '/upload',
    authMiddleware,
    upload.array('images', 10),
    uploadPhotos
);

/**
 * @route   DELETE /api/gallery/:id
 * @desc    Elimina l'asset dal Database e rimuove il file fisico (WebP o WebM)
 * @access  Protetta (Admin)
 */
router.delete('/:id', authMiddleware, deletePhoto);

export default router;