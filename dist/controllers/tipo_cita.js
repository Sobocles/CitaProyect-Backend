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
const sequelize_1 = require("sequelize");
class tipo_cita {
    constructor() {
        this.getTipoCitas = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const desde = Number(req.query.desde) || 0;
                // Obtén el total de tipo de citas
                const totalTipoCitas = yield tipo_cita_1.default.count();
                // Obtén los detalles de todos los tipos de citas con paginación
                const tipo_cita = yield tipo_cita_1.default.findAll({
                    offset: desde,
                    limit: 5, // o el límite que prefieras
                });
                res.json({
                    ok: true,
                    tipo_cita,
                    total: totalTipoCitas
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    msg: 'Error en el servidor',
                });
            }
        });
        this.getTipoCita = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            console.log('ola');
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
            const tipoCitaData = req.body;
            console.log(tipoCitaData);
            try {
                // Crea un nuevo tipo de cita
                const nuevoTipoCita = yield tipo_cita_1.default.create(tipoCitaData);
                res.json({
                    ok: true,
                    tipoCita: nuevoTipoCita,
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
        this.getEspecialidades = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const especialidades = yield tipo_cita_1.default.findAll({
                    attributes: ['especialidad_medica'],
                    where: {
                        especialidad_medica: {
                            [sequelize_1.Op.ne]: null // Esto excluye las entradas donde especialidad_medica es NULL
                        }
                    },
                    group: ['especialidad_medica']
                });
                res.json({ especialidades });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    ok: false,
                    msg: 'Hable con el administrador',
                });
            }
        });
    }
    static get instance() {
        return this._instance || (this._instance = new tipo_cita());
    }
}
exports.default = tipo_cita;
//# sourceMappingURL=tipo_cita.js.map