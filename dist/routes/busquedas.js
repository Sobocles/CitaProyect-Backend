"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const busquedas_1 = require("../controllers/busquedas");
const validar_jwt_1 = __importDefault(require("../middlewares/validar-jwt"));
const router = (0, express_1.Router)();
router.get('/:busqueda', validar_jwt_1.default.instance.validarJwt, busquedas_1.getTodo);
router.get('/coleccion/:tabla/:busqueda', validar_jwt_1.default.instance.validarJwt, busquedas_1.getDocumentosColeccion);
exports.default = router;
//# sourceMappingURL=busquedas.js.map