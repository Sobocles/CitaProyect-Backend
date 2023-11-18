"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const busqueda_cita_1 = require("../controllers/busqueda_cita");
const validar_jwt_1 = __importDefault(require("../middlewares/validar-jwt"));
const router = (0, express_1.Router)();
router.post('/', [
    validar_jwt_1.default.instance.validarJwt,
    // Puedes agregar más validaciones según tus necesidades
], busqueda_cita_1.buscarmedico);
exports.default = router;
//# sourceMappingURL=busqueda_cita.js.map