"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const group_routes_1 = __importDefault(require("./routes/group.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const statistics_routes_1 = __importDefault(require("./routes/statistics.routes"));
const swaggerConfig_1 = require("./swaggerConfig");
const corsOptions_1 = __importDefault(require("./configs/corsOptions"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dbConn_1 = __importDefault(require("./configs/dbConn"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect to MongoDB
(0, dbConn_1.default)();
// Middleware logger
//app.use(logger);
// Middleware for cookies
app.use((0, cookie_parser_1.default)());
// CORS setup
app.use((0, cors_1.default)(corsOptions_1.default));
app.use(express_1.default.json());
// 📌 1️⃣ Morgan - Logger HTTP
app.use((0, morgan_1.default)("dev")); // Affiche les logs des requêtes dans la console
// 📌 2️⃣ Helmet - Sécurité des headers HTTP
app.use((0, helmet_1.default)());
// 📌 3️⃣ Compression - Compression des réponses
app.use((0, compression_1.default)());
app.use("/api-docs", swaggerConfig_1.swaggerUi.serve, swaggerConfig_1.swaggerUi.setup(swaggerConfig_1.swaggerSpec));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/groups", group_routes_1.default);
app.use("/api/messages", message_routes_1.default);
app.use("/api/posts", post_routes_1.default);
app.use("/api/statistics", statistics_routes_1.default);
// Example: Default route (just for testing)
app.get("/", (req, res) => {
    res.send("Welcome to the Auto ecole API");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
