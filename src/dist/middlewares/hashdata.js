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
exports.verifyHashedData = exports.hashData = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Hache des données avec un nombre spécifique de "salt rounds".
 * @param data - Les données à hacher.
 * @param saltRounds - Le nombre de rounds pour le salage (par défaut 10).
 * @returns Une promesse contenant les données hachées.
 */
const hashData = (data_1, ...args_1) => __awaiter(void 0, [data_1, ...args_1], void 0, function* (data, saltRounds = 10) {
    try {
        const hashedData = yield bcrypt_1.default.hash(data, saltRounds);
        return hashedData;
    }
    catch (error) {
        throw new Error(`Erreur lors du hachage des données : ${error.message}`);
    }
});
exports.hashData = hashData;
/**
 * Vérifie si des données non hachées correspondent à un hachage.
 * @param unhashed - Les données non hachées.
 * @param hashed - Le hachage à vérifier.
 * @returns Une promesse contenant un booléen indiquant si les données correspondent.
 */
const verifyHashedData = (unhashed, hashed) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const match = yield bcrypt_1.default.compare(unhashed, hashed);
        return match;
    }
    catch (error) {
        throw new Error(`Erreur lors de la vérification du hachage : ${error.message}`);
    }
});
exports.verifyHashedData = verifyHashedData;
