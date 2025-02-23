import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes"
import groupRoutes from "./routes/group.routes";
import messageRoutes from "./routes/message.routes"
import postRoutes from "./routes/post.routes";
import statistics from "./routes/statistics.routes"
import { swaggerUi, swaggerSpec } from "./swaggerConfig";
import corsOption from "./configs/corsOptions";
import cookieParser from "cookie-parser";
import connectDB from "./configs/dbConn";
import dotenv from 'dotenv';
dotenv.config();


const app = express();
// Connect to MongoDB
connectDB();

// Middleware logger
//app.use(logger);

// Middleware for cookies
app.use(cookieParser());


// CORS setup
app.use(cors(corsOption));

app.use(express.json());

// 📌 1️⃣ Morgan - Logger HTTP
app.use(morgan("dev")); // Affiche les logs des requêtes dans la console

// 📌 2️⃣ Helmet - Sécurité des headers HTTP
app.use(helmet());

// 📌 3️⃣ Compression - Compression des réponses
app.use(compression());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/statistics", statistics);



// Example: Default route (just for testing)
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Auto ecole API");
});

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
