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
exports.getAllFacturas = void 0;
const factura_1 = __importDefault(require("../models/factura"));
const cita_medica_1 = __importDefault(require("../models/cita_medica"));
const usuario_1 = __importDefault(require("../models/usuario"));
const medico_1 = __importDefault(require("../models/medico"));
function getAllFacturas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const facturas = yield factura_1.default.findAll({
                include: [{
                        model: cita_medica_1.default,
                        as: 'citaMedica',
                        include: [
                            {
                                model: usuario_1.default,
                                as: 'paciente',
                                attributes: ['rut', 'nombre', 'apellidos']
                            },
                            {
                                model: medico_1.default,
                                as: 'medico',
                                attributes: ['rut', 'nombre', 'apellidos']
                            }
                        ],
                        attributes: ['motivo']
                    }],
                attributes: ['id_factura', 'payment_method_id', 'transaction_amount', 'monto_pagado'] // Incluye 'id_factura' aquí
            });
            if (!facturas || facturas.length === 0) {
                return res.status(404).json({ message: 'No se encontraron facturas' });
            }
            const facturaInfo = facturas.map(factura => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                return ({
                    idFactura: factura.id_factura,
                    rutPaciente: (_b = (_a = factura.citaMedica) === null || _a === void 0 ? void 0 : _a.paciente) === null || _b === void 0 ? void 0 : _b.rut,
                    nombrePaciente: (_d = (_c = factura.citaMedica) === null || _c === void 0 ? void 0 : _c.paciente) === null || _d === void 0 ? void 0 : _d.nombre,
                    apellidosPaciente: (_f = (_e = factura.citaMedica) === null || _e === void 0 ? void 0 : _e.paciente) === null || _f === void 0 ? void 0 : _f.apellidos,
                    motivoCita: (_g = factura.citaMedica) === null || _g === void 0 ? void 0 : _g.motivo,
                    rutMedico: (_j = (_h = factura.citaMedica) === null || _h === void 0 ? void 0 : _h.medico) === null || _j === void 0 ? void 0 : _j.rut,
                    nombreMedico: (_l = (_k = factura.citaMedica) === null || _k === void 0 ? void 0 : _k.medico) === null || _l === void 0 ? void 0 : _l.nombre,
                    apellidosMedico: (_o = (_m = factura.citaMedica) === null || _m === void 0 ? void 0 : _m.medico) === null || _o === void 0 ? void 0 : _o.apellidos,
                    paymentMethodId: factura.payment_method_id,
                    transactionAmount: factura.transaction_amount,
                    montoPagado: factura.monto_pagado
                });
            });
            res.status(200).json(facturaInfo);
        }
        catch (error) {
            console.error('Error al obtener las facturas:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
}
exports.getAllFacturas = getAllFacturas;
//# sourceMappingURL=facturas.js.map