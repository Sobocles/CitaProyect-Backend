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
const horario_clinica_1 = __importDefault(require("../models/horario_clinica"));
const horario_medico_1 = __importDefault(require("../models/horario_medico"));
class Horario_clinica {
    constructor() {
        this.obtenerHorariosClinica = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('ola');
            try {
                const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
                const horariosClinica = [];
                for (const dia of dias) {
                    const horarioApertura = yield horario_medico_1.default.min('horaInicio', {
                        where: { diaSemana: dia }
                    });
                    const horarioCierre = yield horario_medico_1.default.max('horaFinalizacion', {
                        where: { diaSemana: dia }
                    });
                    horariosClinica.push({
                        dia,
                        horarioApertura,
                        horarioCierre
                    });
                }
                return res.json({
                    ok: true,
                    horariosClinica
                });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({
                    ok: false,
                    msg: 'Error inesperado al obtener los horarios. Por favor, revisa los logs.'
                });
            }
        });
        this.getHorarioClinica = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const horario_clinica = yield horario_clinica_1.default.findByPk(id);
                if (!horario_clinica) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Horario clinica no encontrado',
                    });
                }
                res.json({
                    ok: true,
                    horario_clinica,
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
        this.CrearHorarioClinica = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const horario_clinica = req.body;
            try {
                // Verifica si ya existe un médico con el mismo ID
                const horario_clinica_Existente = yield horario_clinica_1.default.findByPk(horario_clinica.id);
                if (horario_clinica_Existente) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya existe un Horario clinica con el mismo ID',
                    });
                }
                // Crea un nuevo médico
                const nuevo_horario_clinica = yield horario_clinica_1.default.create(horario_clinica);
                res.json({
                    ok: true,
                    historial: nuevo_horario_clinica,
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
        this.putHorarioClinica = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { body } = req;
                // Buscar el médico por su ID
                const horario_clinica = yield horario_clinica_1.default.findByPk(id);
                if (!horario_clinica) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Horario clinica no encontrado',
                    });
                }
                // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
                yield horario_clinica.update(body);
                res.json({
                    ok: true,
                    msg: 'Horario clinica actualizado correctamente',
                    horario_clinica,
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
        this.deleteHorarioClinica = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const horario_clinica = yield horario_clinica_1.default.findByPk(id);
                if (!horario_clinica) {
                    return res.status(404).json({
                        msg: 'No existe un Horario clinica con el id ' + id,
                    });
                }
                yield horario_clinica.destroy();
                res.json({ msg: 'Horario clinica eliminado correctamente' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    msg: 'Error en el servidor',
                });
            }
        });
    }
    static get instance() {
        return this._instance || (this._instance = new Horario_clinica());
    }
}
exports.default = Horario_clinica;
//# sourceMappingURL=horario_clinica.js.map