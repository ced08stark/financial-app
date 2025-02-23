import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string, role: string };
    }
  }
}


export interface AuthenticatedRequest extends Request {
  user?: jwt.JwtPayload & { id: string, role: string }; // Ajoutez les types possibles ici
}
