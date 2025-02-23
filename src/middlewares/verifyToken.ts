import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, NextFunction  } from 'express';
import { AuthenticatedRequest } from '../types/types';


export const authMiddleware   = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1] || ""; // Récupérer le token dans l'en-tête Authorization

  if (!token) {
     res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
     return;
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'default_secret_key'; // Remplacez par votre clé secrète
    const decoded = jwt.verify(token, secretKey) as JwtPayload; // Décode le token

    if (decoded && typeof decoded === 'object' && decoded.id) {
       req.user = { id: decoded.id, role: decoded.role }; // Injecte l'id dans req.user
       next();
    } else {
       res.status(400).json({ message: 'Token invalide.' });
    }
  } catch (error) {
     res.status(400).json({ message: 'Token invalide.' });
  }
};
