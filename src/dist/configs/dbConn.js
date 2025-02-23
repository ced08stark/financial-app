"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Connecte l'application à la base de données MongoDB.
 */
// const connectDB = async (): Promise<void> => {
//   try {
//     await mongoose.connect("mongodb+srv://cedricngangue08:iA20XwVr0mvrWZ8p@cluster0.ai5pv.mongodb.net/Cluster0?retryWrites=true&w=majority");
//     console.log("Connected to MongoDB")
//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err)
//   }
// }
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Attempting to connect to MongoDB...");
        console.log("URI:", process.env.DATABASE_URI); // Remplacez par une variable d'environnement pour plus de sécurité
        yield mongoose_1.default.connect(process.env.DATABASE_URI || "mongodb+srv://cedricngangue08:rludk68ZjTVuzLdQ@cluster.4rclv.mongodb.net/cluster?retryWrites=true&w=majority");
        console.log("Connected to MongoDB");
    }
    catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
});
exports.default = connectDB;
