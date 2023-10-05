"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generarJWT = (rut) => {
    return new Promise((resolve, reject) => {
        const payload = {
            rut,
        };
        jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET || '', {
            expiresIn: '12h',
        }, (err, token) => {
            if (err) {
                console.error(err);
                reject('No se pudo generar el JWT');
            }
            else {
                resolve(token || '');
            }
        });
    });
};
exports.generarJWT = generarJWT;
//# sourceMappingURL=generar-jwt.js.map