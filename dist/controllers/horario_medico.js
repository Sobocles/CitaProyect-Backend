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
const medico_1 = __importDefault(require("../models/medico"));
class HorarioMedico {
    constructor() {
        this.getHorariosMedicos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const medicos = yield medico_1.default.findAll();
            console.log(medicos);
            res.json({ medicos });
        });
        this.getHorarioMedico = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const medico = yield medico_1.default.findByPk(id);
                if (!medico) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Horario medico no encontrado',
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
        this.CrearHorarioMedico = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const medicoData = req.body;
            console.log(medicoData);
            try {
                // Verifica si ya existe un médico con el mismo ID
                const medicoExistente = yield medico_1.default.findByPk(medicoData.id);
                if (medicoExistente) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya existe un horario con el mismo ID',
                    });
                }
                // Crea un nuevo médico
                const nuevoMedico = yield medico_1.default.create(medicoData);
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
        this.putHorarioMedico = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { body } = req;
                // Buscar el médico por su ID
                const medico = yield medico_1.default.findByPk(id);
                if (!medico) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Horario medico no encontrado',
                    });
                }
                // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
                yield medico.update(body);
                res.json({
                    ok: true,
                    msg: 'Horario medico actualizado correctamente',
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
        this.deleteHorarioMedico = (req, res) => __awaiter(this, void 0, void 0, function* () {
        });
    }
    static get instance() {
        return this._instance || (this._instance = new HorarioMedico());
    }
}
exports.default = HorarioMedico;
//# sourceMappingURL=horario_medico.js.map