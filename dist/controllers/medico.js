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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const medico_1 = __importDefault(require("../models/medico"));
const horario_medico_1 = __importDefault(require("../models/horario_medico"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = __importDefault(require("../helpers/jwt"));
class Medicos {
    constructor() {
        this.getMedicos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const desde = Number(req.query.desde) || 0;
                // Obtén el total de médicos
                const totalMedicos = yield medico_1.default.count();
                // Obtén los detalles de todos los médicos
                const medicos = yield medico_1.default.findAll({
                    // Filtras los campos que deseas
                    offset: desde,
                    limit: 5,
                });
                res.json({
                    ok: true,
                    medicos,
                    total: totalMedicos
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    msg: 'Error en el servidor',
                });
            }
        });
        this.getAllMedicos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Obtén el total de médicos
                const totalMedicos = yield medico_1.default.count();
                // Obtén los detalles de todos los médicos
                const medicos = yield medico_1.default.findAll();
                res.json({
                    ok: true,
                    medicos,
                    total: totalMedicos
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    msg: 'Error en el servidor',
                });
            }
        });
        this.getMedico = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { rut } = req.params;
            try {
                const medico = yield medico_1.default.findByPk(rut);
                if (!medico) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Médico no encontrado',
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
        this.CrearMedico = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const _a = req.body, { email, password } = _a, medicoData = __rest(_a, ["email", "password"]);
            try {
                // Verificar si el correo ya está registrado en la tabla de médicos
                const existeEmailMedico = yield medico_1.default.findOne({ where: { email } });
                if (existeEmailMedico) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'El correo ya está registrado para otro médico',
                    });
                }
                // Encriptar contraseña
                const saltRounds = 10; // Número de rondas de cifrado
                const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
                // Crea un nuevo médico
                const nuevoMedico = yield medico_1.default.create(Object.assign(Object.assign({}, medicoData), { email: email, password: hashedPassword, rol: 'MEDICO_ROLE' // Asumiendo que el rol para los médicos es 'MEDICO'
                 }));
                // Genera el JWT
                const token = yield jwt_1.default.instance.generarJWT(nuevoMedico.rut, nuevoMedico.nombre, nuevoMedico.apellidos, nuevoMedico.rol);
                res.json({
                    ok: true,
                    msg: "Medico creado exitosamente",
                    medico: nuevoMedico,
                    token
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
        this.putMedico = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { rut } = req.params;
                const { body } = req;
                console.log('aqui esta el rut', rut);
                // Buscar el médico por su ID
                const medico = yield medico_1.default.findByPk(rut);
                if (!medico) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'Médico no encontrado',
                    });
                }
                // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
                yield medico.update(body);
                res.json({
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
        this.deleteMedico = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { rut } = req.params;
            try {
                const medico = yield medico_1.default.findByPk(rut);
                if (!medico) {
                    return res.status(404).json({
                        msg: 'No existe un médico con el id ' + rut,
                    });
                }
                // Eliminar los horarios relacionados con el médico
                yield horario_medico_1.default.destroy({
                    where: { rutMedico: medico.rut }, // Asumiendo que el campo se llama "rutMedico"
                });
                // Ahora puedes eliminar al médico
                yield medico.destroy();
                res.json({ msg: 'Médico y sus horarios eliminados correctamente' });
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
        return this._instance || (this._instance = new Medicos());
    }
}
exports.default = Medicos;
;
//# sourceMappingURL=medico.js.map