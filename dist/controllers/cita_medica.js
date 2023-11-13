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
const sequelize_1 = require("sequelize");
const factura_1 = __importDefault(require("../models/factura"));
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
        this.getCitasMedico = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { rut_medico } = req.params;
            const desde = Number(req.query.desde) || 0;
            const limite = Number(req.query.limite) || 5;
            try {
                // Contar total de citas para este médico
                const totalCitas = yield cita_medica_1.default.count({
                    where: {
                        rut_medico: rut_medico,
                        estado: {
                            [sequelize_1.Op.or]: ['en_curso', 'pagado']
                        }
                    }
                });
                // Obtener las citas con paginación y detalles de paciente y médico
                const citas = yield cita_medica_1.default.findAll({
                    where: {
                        rut_medico: rut_medico,
                        estado: {
                            [sequelize_1.Op.or]: ['en_curso', 'pagado']
                        }
                    },
                    include: [
                        {
                            model: usuario_1.default,
                            as: 'paciente',
                            attributes: ['nombre', 'apellidos'] // Atributos del paciente
                        },
                        {
                            model: medico_1.default,
                            as: 'medico',
                            attributes: ['nombre', 'apellidos'] // Atributos del médico
                        }
                    ],
                    attributes: { exclude: ['rut_paciente', 'rut_medico'] },
                    offset: desde,
                    limit: limite
                });
                if (!citas || citas.length === 0) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'No se encontraron citas para este médico',
                    });
                }
                res.json({
                    ok: true,
                    citas,
                    total: totalCitas
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    ok: false,
                    msg: 'Error interno del servidor',
                });
            }
        });
        this.getCitaFactura = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const idCita = parseInt(req.params.idCita);
            console.log('AQUI ESTA EL ID DE LA CITA QUE LLEGA AL METODO getCitaFactura', idCita);
            if (!idCita) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Es necesario el ID de la cita médica'
                });
            }
            try {
                const citaMedica = yield cita_medica_1.default.findOne({
                    where: { idCita },
                    include: [
                        {
                            model: factura_1.default,
                            as: 'factura',
                            required: false // Esto es para permitir citas sin factura
                        },
                        {
                            model: medico_1.default,
                            as: 'medico',
                            attributes: ['nombre', 'apellidos', 'especialidad_medica'] // Solo incluir los atributos necesarios
                        },
                        {
                            model: usuario_1.default,
                            as: 'paciente',
                            attributes: ['nombre', 'apellidos', 'email'] // Solo incluir los atributos necesarios
                        },
                        // Puedes incluir más asociaciones si son necesarias
                    ]
                });
                console.log('AQUI ESTA LA INFORMACION DE LA CITA MEDICA', citaMedica);
                if (!citaMedica) {
                    return res.status(404).json({
                        ok: false,
                        mensaje: 'Cita médica no encontrada'
                    });
                }
                return res.json({
                    ok: true,
                    citaMedica
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('Error al obtener la cita médica y su factura:', error.message);
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al obtener la cita médica y su factura',
                        error: error.message
                    });
                }
                else {
                    // 
                    console.error('Error inesperado al obtener la cita médica y su factura');
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error inesperado al obtener la cita médica y su factura'
                    });
                }
            }
        });
        this.crearCita = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log('AQUI ESTA LLEGANDO', req);
            let citaData = req.body.cita;
            console.log('AQUI ESTA LLEGANDO', citaData);
            try {
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
        this.crearCitaPaciente = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // Desestructura los datos necesarios del cuerpo de la solicitud
            const { rutMedico, hora_inicio, hora_fin, idTipoCita, especialidad, rutPaciente, fecha } = req.body;
            try {
                // Crea la cita médica con el estado no_pagado
                const cita = yield cita_medica_1.default.create({
                    rut_paciente: rutPaciente,
                    rut_medico: rutMedico,
                    fecha: fecha,
                    hora_inicio,
                    hora_fin,
                    estado: 'no_pagado',
                    motivo: especialidad,
                    idTipoCita,
                });
                // Sequelize automáticamente añade el ID al objeto 'cita'
                // Devuelve el ID de la cita y cualquier otro dato que desees
                console.log('Cita creada con ID:', cita.idCita);
                return res.status(201).json({
                    ok: true,
                    cita: {
                        idCita: cita.idCita, // Asegúrate de que 'idCita' sea el nombre correcto de la propiedad en tu modelo
                        // ... otros datos de la cita si son necesarios
                    }
                });
            }
            catch (error) {
                console.error('Error al crear la cita médica:', error);
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al crear la cita médica',
                    error
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