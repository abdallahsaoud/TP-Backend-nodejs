import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import File from '../models/File';

const MAX_QUOTA = 2 * 1024 * 1024 * 1024; // 2 Go en octets

// Configurer Multer pour le stockage local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Calculer la taille totale des fichiers pour un utilisateur donné
const calculateUserStorage = async (userId: number) => {
  const files = await File.findAll({ where: { user_id: userId } });
  return files.reduce((total, file) => total + file.filesize, 0);
};

// Contrôleur d'upload de fichier avec vérification du quota
export const uploadFile = async (req: Request & { user?: { id: number } }, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié.' });
    }

    // Calculer l'espace utilisé par l'utilisateur
    const usedStorage = await calculateUserStorage(userId);

    // Vérifier que le fichier est bien défini
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier n'a été fourni." });
    }

    const fileSize = req.file.size;
    if (usedStorage + fileSize > MAX_QUOTA) {
      return res.status(400).json({ message: "Quota de 2 Go dépassé. Impossible d'uploader ce fichier." });
    }

    // Stocker les informations du fichier dans la base de données
    const newFile = await File.create({
      filename: req.file.filename,
      filepath: req.file.path,
      filesize: fileSize,
      user_id: userId,
    });

    res.status(201).json({ message: "Fichier uploadé avec succès", file: newFile });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'upload du fichier", error });
  }
};

export { upload };
