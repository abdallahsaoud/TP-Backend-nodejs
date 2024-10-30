import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

router.post('/register', register); // Route pour l'inscription
router.post('/login', login);       // Route pour la connexion

export default router;
