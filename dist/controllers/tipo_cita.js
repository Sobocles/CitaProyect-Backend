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
const tipo_cita_1 = __importDefault(require("../models/tipo_cita"));
class tipo_cita {
    constructor() {
        this.getTipoCitas = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const medicos = yield tipo_cita_1.default.findAll();
            console.log(medicos);
            res.json({ medicos });
        });
        this.getTipoCita = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const medico = yield tipo_cita_1.default.findByPk(id);
                if (!medico) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Tipo de cita no encontrado',
                    });
                }
                res.json({
                    ok: true,
                    medico,
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
        this.crearTipoCita = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const medicoData = req.body;
            console.log(medicoData);
            try {
                // Verifica si ya existe un médico con el mismo ID
                const medicoExistente = yield tipo_cita_1.default.findByPk(medicoData.id);
                if (medicoExistente) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya existe un tipo de cita con el mismo ID',
                    });
                }
                // Crea un nuevo médico
                const nuevoMedico = yield tipo_cita_1.default.create(medicoData);
                res.json({
                    ok: true,
                    medico: nuevoMedico,
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
        this.putTipoCita = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { body } = req;
                // Buscar el médico por su ID
                const medico = yield tipo_cita_1.default.findByPk(id);
                if (!medico) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Tipo de cita no encontrado',
                    });
                }
                // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
                yield medico.update(body);
                res.json({
                    ok: true,
                    msg: 'tipo de cita actualizado correctamente',
                    medico,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    ok: false,
                    msg: 'Hable con el administrador',
                });
            }
        });
        this.deleteTipoCita = (req, res) => __awaiter(this, void 0, void 0, function* () {
        });
    }
    static get instance() {
        return this._instance || (this._instance = new tipo_cita());
    }
}
exports.default = tipo_cita;
//# sourceMappingURL=tipo_cita.js.map