import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret';

interface AuthenticatedRequest extends Request {
  user?: { id: number; email: string };
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'Accès refusé. Aucun token fourni.' });
    }

    // Vérification du token
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number; email: string };
    req.user = decoded; // Ajout des informations de l'utilisateur décodé dans la requête
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide ou expiré', error });
  }
};
