import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from '../types/types';
/**
 * Middleware pour vérifier si l'utilisateur est administrateur
 */
const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
       res.status(401).json({ message: "Accès non autorisé" });
       return;
    }

    // Vérifier si le rôle de l'utilisateur est "admin"
    if (req.user.role !== "admin") {
       res.status(403).json({ message: "Accès interdit, administrateur requis" });
       return;
    }

    next(); // Passer au middleware suivant ou au contrôleur
  } catch (error) {
    res.status(500).json({ message: "Erreur interne du serveur", error });
  }
};

export default adminMiddleware;
