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
exports.getTodo = exports.getDocumentosColeccion = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const medico_1 = __importDefault(require("../models/medico"));
const sequelize_1 = require("sequelize"); // Importa el operador Op para realizar búsquedas avanzadas
const horario_medico_1 = __importDefault(require("../models/horario_medico"));
const cita_medica_1 = __importDefault(require("../models/cita_medica"));
const tipo_cita_1 = __importDefault(require("../models/tipo_cita"));
const getDocumentosColeccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    let data = [];
    switch (tabla) {
        case 'usuarios':
            data = yield usuario_1.default.findAll({
                attributes: ['rut', 'nombre', 'apellidos', 'email', 'fecha_nacimiento', 'telefono', 'direccion', 'rol'],
                where: {
                    nombre: {
                        [sequelize_1.Op.like]: `%${busqueda}%`
                    }
                }
            });
            break;
        case 'medicos':
            data = yield medico_1.default.findAll({
                attributes: ['rut', 'foto', 'nombre', 'apellidos', 'telefono', 'email', 'direccion', 'nacionalidad', 'especialidad_medica'],
                where: {
                    Nombre: {
                        [sequelize_1.Op.like]: `%${busqueda}%`
                    }
                }
            });
            break;
        case 'horario_medico':
            data = yield horario_medico_1.default.findAll({
                attributes: ['idHorario', 'diaSemana', 'horaInicio', 'horaFinalizacion', 'disponibilidad', 'fechaCreacion'],
                where: {
                    diaSemana: {
                        [sequelize_1.Op.like]: `%${busqueda}%`
                    }
                },
                include: [{
                        model: medico_1.default,
                        as: 'medico',
                        attributes: ['nombre', 'especialidad_medica'] // solo incluir el nombre del médico
                    }]
            });
            break;
        case 'cita_medica':
            data = yield cita_medica_1.default.findAll({
                attributes: ['idCita', 'motivo', 'fecha', 'hora_inicio', 'hora_fin', 'estado'],
                include: [
                    {
                        model: usuario_1.default,
                        as: 'paciente',
                        attributes: ['nombre'],
                        required: true
                    },
                    {
                        model: medico_1.default,
                        as: 'medico',
                        attributes: ['nombre'],
                        required: true
                    },
                    {
                        model: tipo_cita_1.default,
                        as: 'tipoCita',
                        attributes: ['especialidad_medica'],
                    }
                ],
                where: {
                    [sequelize_1.Op.or]: [
                        { '$paciente.nombre$': { [sequelize_1.Op.like]: `%${busqueda}%` } },
                        { '$medico.nombre$': { [sequelize_1.Op.like]: `%${busqueda}%` } }
                    ]
                }
            });
            break;
        case 'tipo_cita':
            data = yield tipo_cita_1.default.findAll({
                attributes: ['idTipo', 'tipo_cita', 'precio', 'especialidad_medica', 'duracion_cita'],
                where: {
                    especialidad_medica: {
                        [sequelize_1.Op.like]: `%${busqueda}%`
                    }
                }
            });
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'Por ahora solo se soporta la búsqueda de usuarios y médicos'
            });
    }
    console.log('aqui' + data);
    res.json({
        ok: true,
        citas: data
    });
});
exports.getDocumentosColeccion = getDocumentosColeccion;
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