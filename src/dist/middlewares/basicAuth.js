"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const basic_auth_1 = __importDefault(require("basic-auth"));
const auth = (req, res, next) => {
    const user = (0, basic_auth_1.default)(req);
    if (user &&
        user.name === process.env.BASIC_AUTH_USER_NAME &&
        user.pass === process.env.BASIC_AUTH_USER_PWD) {
        return next();
    }
    res.set("WWW-Authenticate", 'Basic realm="401"');
    res.status(401).send("Authentication required.");
};
exports.default = auth;
