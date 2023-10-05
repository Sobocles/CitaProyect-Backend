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
exports.getTodo = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const medico_1 = __importDefault(require("../models/medico"));
const sequelize_1 = require("sequelize"); // Importa el operador Op para realizar búsquedas avanzadas
const getTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("ola");
    try {
        const busqueda = req.params.busqueda;
        const regex = new RegExp(busqueda, 'i');
        const [usuarios, medicos] = yield Promise.all([
            usuario_1.default.findAll({ where: { nombre: { [sequelize_1.Op.like]: `%${busqueda}%` } } }),
            medico_1.default.findAll({ where: { nombre: { [sequelize_1.Op.like]: `%${busqueda}%` } } }),
        ]);
        res.json({
            ok: true,
            resultados: { usuarios, medicos },
        });
    }
    catch (error) {
        console.error('Error en la búsqueda:', error);
        res.status(500).json({ ok: false, mensaje: 'Error en la búsqueda' });
    }
});
exports.getTodo = getTodo;
//# sourceMappingURL=busquedas.js.map