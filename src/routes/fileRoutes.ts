import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { uploadFile, upload } from '../controllers/fileController';

const router = Router();

// Route d'upload de fichier protégée par le middleware d'authentification
router.post('/upload', authMiddleware, upload.single('file'), uploadFile);

export default router;
