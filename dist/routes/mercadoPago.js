"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mercadoPago_1 = require("../controllers/mercadoPago");
const facturas_1 = require("../controllers/facturas");
const validar_jwt_1 = __importDefault(require("../middlewares/validar-jwt"));
const router = (0, express_1.Router)();
router.post('/create-order', validar_jwt_1.default.instance.validarJwt, mercadoPago_1.createOrder);
router.get('/success', (req, res) => res.send('success'));
router.get('/factura', facturas_1.getAllFacturas);
router.delete('/factura/:id', validar_jwt_1.default.instance.validarJwt, facturas_1.eliminarFactura);
router.get('/factura/:id', validar_jwt_1.default.instance.validarJwt, facturas_1.obtenerFacturaPorId);
router.get('/failure', (req, res) => res.send('failure'));
router.get('/pending', (req, res) => res.send('pending'));
router.post('/webhook', mercadoPago_1.receiveWebhook);
exports.default = router;
//# sourceMappingURL=mercadoPago.js.map