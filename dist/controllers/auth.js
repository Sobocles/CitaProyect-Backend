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
exports.renewToken = exports.login = void 0;
const usuario_1 = __importDefault(require("../models/usuario")); // Asegúrate de importar el modelo correcto
const bcrypt_1 = __importDefault(require("bcrypt"));
const generar_jwt_1 = require("../helpers/generar-jwt");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(email);
    try {
        // Verificar email
        const usuarioDB = yield usuario_1.default.findOne({ where: { email } });
        console.log(usuarioDB);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado',
            });
        }
        // Verificar contraseña
        const validPassword = bcrypt_1.default.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida',
            });
        }
        // Generar el TOKEN - JWT
        console.log(usuarioDB.rut);
        const token = yield (0, generar_jwt_1.generarJWT)(usuarioDB.rut);
        res.json({
            ok: true,
            token,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
        });
    }
});
exports.login = login;
const renewToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const rut = req.uid;
    console.log(rut);
    try {
        // Generar el TOKEN - JWT
        const token = yield (0, generar_jwt_1.generarJWT)(rut);
        // Obtener el usuario por UID
        const usuario = yield usuario_1.default.findByPk(rut);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado',
            });
        }
        res.json({
            ok: true,
            token,
            usuario,
            // Se le envía el rol del usuario para revisar sus privilegios (USER_ROLE, ADMIN_ROLE)
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al renovar el token',
        });
    }
});
exports.renewToken = renewToken;
//# sourceMappingURL=auth.js.map