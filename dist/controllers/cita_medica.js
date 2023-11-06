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
const cita_medica_1 = __importDefault(require("../models/cita_medica"));
const usuario_1 = __importDefault(require("../models/usuario"));
const medico_1 = __importDefault(require("../models/medico"));
const tipo_cita_1 = __importDefault(require("../models/tipo_cita"));
class Cita {
    constructor() {
        this.getCitas = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const desde = Number(req.query.desde) || 0;
                // Obtén el total de citas
                const totalCitas = yield cita_medica_1.default.count();
                const citas = yield cita_medica_1.default.findAll({
                    include: [
                        {
                            model: usuario_1.default,
                            as: 'paciente',
                            attributes: ['nombre'], // Nombre del paciente
                        },
                        {
                            model: medico_1.default,
                            as: 'medico',
                            attributes: ['nombre'], // Nombre del médico
                        },
                        {
                            model: tipo_cita_1.default,
                            as: 'tipoCita',
                            attributes: ['especialidad_medica'], // Tipo de cita
                        },
                    ],
                    attributes: ['idCita', 'motivo', 'fecha', 'hora_inicio', 'hora_fin', 'estado'],
                    offset: desde,
                    limit: 5, // Límite de registros por página
                });
                res.json({
                    ok: true,
                    citas,
                    total: totalCitas
                });
            }
            catch (error) {
                console.error('Error al obtener citas:', error);
                res.status(500).json({ error: 'Error al obtener citas' });
            }
        });
        this.getCita = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const medico = yield cita_medica_1.default.findByPk(id);
                if (!medico) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Cita no encontrado',
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
        this.crearCita = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('AQUI ESTA LLEGANDO', req);
            let citaData = req.body.cita; // Accede directamente al objeto cita
            console.log('AQUI ESTA LLEGANDO', citaData);
            // No necesitas reasignar ruts, ya que están presentes en el objeto citaData
            // No necesitas eliminar las propiedades paciente y medico, ya que no están presentes
            try {
                // Verifica si ya existe una cita con el mismo ID
                const citaExistente = yield cita_medica_1.default.findByPk(citaData.idCita);
                if (citaExistente) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya existe una cita con el mismo ID',
                    });
                }
                // Crea una nueva cita
                const nuevaCita = yield cita_medica_1.default.create(citaData);
                res.json({
                    ok: true,
                    cita: nuevaCita,
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
        this.putCita = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { body } = req;
                console.log('aqui esta el id', id);
                console.log('aqui esta el body', body);
                // Buscar el médico por su ID
                const cita = yield cita_medica_1.default.findByPk(id);
                if (!cita) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'cita no encontrada',
                    });
                }
                // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
                yield cita.update(body);
                res.json({
                    ok: true,
                    msg: 'Médico actualizado correctamente',
                    cita,
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
        this.deleteCita = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const cita = yield cita_medica_1.default.findByPk(id);
                if (!cita) {
                    return res.status(404).json({
                        msg: 'No existe un cita con el id ' + id,
                    });
                }
                yield cita.destroy();
                res.json({ msg: 'Cita eliminadoa correctamente' });
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
        return this._instance || (this._instance = new Cita());
    }
}
exports.default = Cita;
//# sourceMappingURL=cita_medica.js.map