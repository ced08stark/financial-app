import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { Request, Response, NextFunction } from "express";

// Fonction pour enregistrer les événements dans les logs
export const logEvent = async (message: string, logName: string): Promise<void> => {
  const date = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${date}\t${uuid()}\t${message}\n`;

  try {
    const logDir = path.join(__dirname, "..", "logs");

    // Vérifie si le dossier "logs" existe, sinon le crée
    if (!fs.existsSync(logDir)) {
      await fsPromises.mkdir(logDir);
    }

    // Ajoute l'élément de log au fichier spécifié
    await fsPromises.appendFile(path.join(logDir, logName), logItem);
  } catch (err) {
    console.error("Error writing to log file:", err);
  }
};

// Middleware pour enregistrer les requêtes HTTP
export const logger = (req: Request, res: Response, next: NextFunction): void => {
  logEvent(`${req.method}\t${req.headers.origin ?? "unknown"}\t${req.url}`, "reqLog.txt");
  next();
};
