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
exports.deleteUsuario = exports.putUsuario = exports.CrearUsuario = exports.getUsuario = exports.getAllUsuarios = exports.getUsuarios = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const jwt_1 = __importDefault(require("../helpers/jwt"));
const historial_medico_1 = __importDefault(require("../models/historial_medico"));
const cita_medica_1 = __importDefault(require("../models/cita_medica"));
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const desde = Number(req.query.desde) || 0;
        // Obtén el total de usuarios
        const totalUsuarios = yield usuario_1.default.count();
        // Obtén los detalles de todos los usuarios con paginación y sin mostrar campos sensibles
        const usuarios = yield usuario_1.default.findAll({
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            },
            offset: desde,
            limit: 5,
        });
        res.json({
            ok: true,
            usuarios,
            total: totalUsuarios
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});
exports.getUsuarios = getUsuarios;
// Método para obtener a todos los pacientes
const getAllUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('olaaaaaaaaaaaaa');
    try {
        // Obtén los ruts de los pacientes con citas en estados 'en_curso' o 'no_asistio'
        const rutsPacientesConCitas = yield cita_medica_1.default.findAll({
            where: {
                estado: ['en_curso', 'no_asistido']
            },
            attributes: ['rut_paciente'],
            group: ['rut_paciente']
        });
        // Extrae solo los ruts de los pacientes
        const rutsExcluidos = rutsPacientesConCitas.map(cita => cita.rut_paciente);
        // Obtén los detalles de todos los pacientes que no tienen citas en esos estados y que no son administradores
        const usuarios = yield usuario_1.default.findAll({
            where: {
                rut: {
                    [sequelize_1.Op.notIn]: rutsExcluidos
                },
                rol: {
                    [sequelize_1.Op.ne]: 'ADMIN_ROLE' // Excluye a los usuarios con rol 'ADMIN_ROLE'
                }
            },
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            }
        });
        // Obtén el total de pacientes que no tienen citas en esos estados
        const totalPacientes = usuarios.length;
        res.json({
            ok: true,
            usuarios,
            total: totalPacientes
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});
exports.getAllUsuarios = getAllUsuarios;
const getUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const usuario = yield usuario_1.default.findByPk(id);
    if (usuario) {
        return res.json(usuario);
    }
    return res.status(404).json({
        msg: `No existe un usuario con el id ${id}`
    });
});
exports.getUsuario = getUsuario;
const CrearUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuario, email, password, nombre, apellidos, rol } = req.body;
    try {
        // Verificar si el correo ya está registrado
        const existeEmail = yield usuario_1.default.findOne({ where: { email } });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado',
            });
        }
        // Encriptar contraseña
        const saltRounds = 10; // Número de rondas de cifrado
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        // Crear un nuevo usuario
        const usuario = yield usuario_1.default.create(Object.assign(Object.assign({}, req.body), { password: hashedPassword }));
        // Generar el TOKEN - JWT
        const token = yield jwt_1.default.instance.generarJWT(usuario.rut, nombre, apellidos, rol);
        res.json({
            ok: true,
            usuario,
            token,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs',
        });
    }
});
exports.CrearUsuario = CrearUsuario;
const putUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { body } = req;
        console.log(body);
        // Buscar el médico por su ID
        const medico = yield usuario_1.default.findByPk(id);
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
exports.putUsuario = putUsuario;
const deleteUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log(id);
    try {
        const usuario = yield usuario_1.default.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                msg: 'No existe un usuario con el id ' + id,
            });
        }
        // Antes de eliminar al usuario, elimina los registros de historial relacionados
        yield historial_medico_1.default.destroy({
            where: { rut_paciente: usuario.rut }, // Asumiendo que el campo se llama "rut_usuario"
        });
        // Ahora puedes eliminar al usuario
        yield usuario.destroy();
        res.json({ msg: 'Usuario y sus registros de historial eliminados correctamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Error en el servidor',
        });
    }
});
exports.deleteUsuario = deleteUsuario;
//# sourceMappingURL=usuario.js.map