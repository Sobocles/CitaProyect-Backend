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
exports.cambiarPassword = exports.deleteUsuario = exports.putUsuario = exports.CrearUsuario = exports.getUsuario = exports.getPacientesConCitasPagadasYEnCurso = exports.getAllUsuarios = exports.getUsuarios = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sequelize_1 = require("sequelize");
const bcrypt_2 = __importDefault(require("bcrypt"));
const jwt_1 = __importDefault(require("../helpers/jwt"));
const historial_medico_1 = __importDefault(require("../models/historial_medico"));
const cita_medica_1 = __importDefault(require("../models/cita_medica"));
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const desde = Number(req.query.desde) || 0;
        // Obtén el total de usuarios activos
        const totalUsuarios = yield usuario_1.default.count({
            where: { estado: 'activo' } // Incluye solo usuarios activos
        });
        // Obtén los detalles de todos los usuarios activos con paginación y sin mostrar campos sensibles
        const usuarios = yield usuario_1.default.findAll({
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            },
            where: { estado: 'activo' },
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
// Método para obtener a todos los pacientes (esto lo usa para obtener pacientes en el formulario historial medico ppara que escriba el medicco al paciente)
const getAllUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtén los ruts de los pacientes con citas en estados 'en_curso', 'no_asistido' y 'pagado'
        const rutsPacientesConCitas = yield cita_medica_1.default.findAll({
            where: {
                estado: ['en_curso', 'no_asistido', 'pagado'] // Incluye 'pagado' en la lista
            },
            attributes: ['rut_paciente'],
            group: ['rut_paciente']
        });
        // Extrae solo los ruts de los pacientes
        const rutsExcluidos = rutsPacientesConCitas.map(cita => cita.rut_paciente);
        // Obtener los detalles de todos los pacientes que no tienen citas en esos estados,
        // que no son administradores y que están activos
        const usuarios = yield usuario_1.default.findAll({
            where: {
                rut: {
                    [sequelize_1.Op.notIn]: rutsExcluidos
                },
                rol: {
                    [sequelize_1.Op.ne]: 'ADMIN_ROLE' // Excluye a los usuarios con rol 'ADMIN_ROLE'
                },
                estado: 'activo' // Incluye solo usuarios activos
            },
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            }
        });
        // Obtén el total de pacientes que no tienen citas en esos estados y que están activos
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
/*
  export const getAllUsuarios = async (req: Request, res: Response) => {


  try {
      // Obtén los ruts de los pacientes con citas en estados 'en_curso' o 'no_asistio'
      const rutsPacientesConCitas = await CitaMedica.findAll({
          where: {
              estado: ['en_curso', 'no_asistido']
          },
          attributes: ['rut_paciente'],
          group: ['rut_paciente']
      });

      // Extrae solo los ruts de los pacientes
      const rutsExcluidos = rutsPacientesConCitas.map(cita => cita.rut_paciente);

      // Obtén los detalles de todos los pacientes que no tienen citas en esos estados y que no son administradores
      const usuarios = await Usuario.findAll({
          where: {
              rut: {
                  [Op.notIn]: rutsExcluidos
              },
              rol: {
                  [Op.ne]: 'ADMIN_ROLE' // Excluye a los usuarios con rol 'ADMIN_ROLE'
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
  } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
  }
};


*/
const getPacientesConCitasPagadasYEnCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rut_medico } = req.params;
    try {
        // Obténer los detalles de los pacientes con citas en estado 'en_curso' y 'pagado' con un médico específico
        const pacientesConCitasPagadas = yield cita_medica_1.default.findAll({
            where: {
                rut_medico,
                estado: ['en_curso', 'pagado'],
                estado_actividad: 'activo' // Solo citas activas
            },
            include: [{
                    model: usuario_1.default,
                    as: 'paciente',
                    where: {
                        rol: { [sequelize_1.Op.ne]: 'ADMIN_ROLE' },
                        estado: 'activo' // Solo usuarios activos
                    },
                    attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
                }]
        });
        // Mapea los resultados para obtener solo los datos de los pacientes
        const usuarios = pacientesConCitasPagadas.map(cita => cita.paciente);
        res.json({
            ok: true,
            usuarios,
            total: usuarios.length
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});
exports.getPacientesConCitasPagadasYEnCurso = getPacientesConCitasPagadasYEnCurso;
/*
export const getPacientesConCitasPagadasYEnCurso = async (req: Request, res: Response) => {
 
  try {
      // Obtén los detalles de los pacientes con citas en estado 'en_curso' y 'pagado'
      const pacientesConCitasPagadas = await CitaMedica.findAll({
          where: {
            estado: ['en_curso', 'pagado'] // Modificado para incluir 'pagado'
          },
          include: [{
              model: Usuario, // Asumiendo que CitaMedica tiene una relación con Usuario
              as: 'paciente',
              where: {
                  rol: {
                      [Op.ne]: 'ADMIN_ROLE' // Excluye a los usuarios con rol 'ADMIN_ROLE'
                  }
              },
              attributes: {
                  exclude: ['password', 'createdAt', 'updatedAt']
              }
          }]
      });

      // Mapea los resultados para obtener solo los datos de los pacientes
      const usuarios = pacientesConCitasPagadas.map(cita => cita.paciente);

      res.json({
          ok: true,
          usuarios,
          total: usuarios.length
      });
  } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
  }
};


*/
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
    const { usuario, email, password, nombre, apellidos, telefono } = req.body;
    try {
        // Verificar si ya existen usuarios en la base de datos
        const existenUsuarios = yield usuario_1.default.count();
        let rol = 'USER_ROLE'; // Rol por defecto
        // Si no hay usuarios, asignar rol de ADMIN_ROLE al primer usuario
        if (existenUsuarios === 0) {
            rol = 'ADMIN_ROLE';
        }
        // Verificar si el correo ya está registrado por un usuario activo
        const existeEmail = yield usuario_1.default.findOne({
            where: {
                email,
                estado: 'activo' // Solo busca entre usuarios activos
            }
        });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado',
            });
        }
        // Verificar si el teléfono ya está registrado por un usuario activo
        const existeTelefono = yield usuario_1.default.findOne({
            where: {
                telefono,
                estado: 'activo' // Solo busca entre usuarios activos
            }
        });
        if (existeTelefono) {
            return res.status(400).json({
                ok: false,
                msg: 'El teléfono ya está registrado',
            });
        }
        // Encriptar contraseña
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        // Crear un nuevo usuario
        const nuevoUsuario = yield usuario_1.default.create(Object.assign(Object.assign({}, req.body), { password: hashedPassword, rol: rol }));
        // Generar el TOKEN - JWT
        const token = yield jwt_1.default.instance.generarJWT(nuevoUsuario.rut, nombre, apellidos, rol);
        res.json({
            ok: true,
            usuario: nuevoUsuario,
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
/*
export const CrearUsuario = async(req: Request, res: Response) => {
  const { usuario, email, password, nombre, apellidos, telefono } = req.body;

  try {
    // Verificar si ya existen usuarios en la base de datos
    const existenUsuarios = await Usuario.count();
    let rol = 'USER_ROLE'; // Rol por defecto

    // Si no hay usuarios, asignar rol de ADMIN_ROLE al primer usuario
    if (existenUsuarios === 0) {
      rol = 'ADMIN_ROLE';
    }

    // Verificar si el correo ya está registrado
    const existeEmail = await Usuario.findOne({ where: { email } });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: 'El correo ya está registrado',
      });
    }

    // Verificar si el teléfono ya está registrado
    const existeTelefono = await Usuario.findOne({ where: { telefono } });
    if (existeTelefono) {
      return res.status(400).json({
        ok: false,
        msg: 'El teléfono ya está registrado',
      });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear un nuevo usuario
    const nuevoUsuario = await Usuario.create({
      ...req.body,
      password: hashedPassword,
      rol: rol,
    });

    // Generar el TOKEN - JWT
    const token = await JwtGenerate.instance.generarJWT(nuevoUsuario.rut, nombre, apellidos, rol);

    res.json({
      ok: true,
      usuario: nuevoUsuario,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado... revisar logs',
    });
  }
};
*/
/*
export const CrearUsuario = async( req: Request, res: Response ) => {
  const { usuario, email, password, nombre, apellidos, rol } = req.body;

    try {
      // Verificar si el correo ya está registrado
      const existeEmail = await Usuario.findOne({ where: { email } });
  
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: 'El correo ya está registrado',
        });
      }
  
      // Encriptar contraseña
      const saltRounds = 10; // Número de rondas de cifrado
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Crear un nuevo usuario
      const usuario = await Usuario.create({
        ...req.body,
        password: hashedPassword,
      });
  
      // Generar el TOKEN - JWT
      const token = await JwtGenerate.instance.generarJWT(usuario.rut, nombre, apellidos, rol);
  
      res.json({
        ok: true,
        usuario,
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        ok: false,
        msg: 'Error inesperado... revisar logs',
      });
    }
  };

*/
const putUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let { body } = req;
        // Buscar el usuario por su ID
        const usuario = yield usuario_1.default.findByPk(id);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado',
            });
        }
        // Si la contraseña no está presente o está vacía en la solicitud, elimínala del objeto body
        if (!body.password || body.password.trim() === '') {
            delete body.password;
        }
        // Actualizar los campos del usuario con los valores proporcionados en el cuerpo de la solicitud
        yield usuario.update(body);
        res.json({
            usuario,
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
    try {
        const usuario = yield usuario_1.default.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ msg: 'No existe un usuario con el id ' + id });
        }
        // Cambiar el estado de las citas médicas a 'inactivo'
        yield cita_medica_1.default.update({ estado_actividad: 'inactivo' }, { where: { rut_paciente: usuario.rut } });
        // Cambiar el estado de los historiales médicos a 'inactivo'
        yield historial_medico_1.default.update({ estado_actividad: 'inactivo' }, { where: { rut_paciente: usuario.rut } });
        // Cambiar el estado del usuario a 'inactivo'
        yield usuario.update({ estado: 'inactivo' });
        res.json({ msg: `Usuario ${usuario.nombre} y todas sus entidades relacionadas han sido actualizadas a inactivo correctamente.` });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});
exports.deleteUsuario = deleteUsuario;
const cambiarPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { rut, password, newPassword } = req.body;
    try {
        // agregar el password nuevo != password anterior
        const dbUsuario = yield usuario_1.default.findByPk(rut);
        if (!dbUsuario) {
            return res.status(400).json({
                msg: `No existe el usuario con id: ${rut}`
            });
        }
        const validPassword = bcrypt_2.default.compareSync(password, dbUsuario.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: `El password es incorrecto`
            });
        }
        const validNewPassword = bcrypt_2.default.compareSync(newPassword, dbUsuario.password);
        if (validNewPassword) {
            return res.status(400).json({
                ok: false,
                msg: `El password nuevo es igual al password anterior`
            });
        }
        const salt = bcrypt_2.default.genSaltSync();
        dbUsuario.password = bcrypt_2.default.hashSync(newPassword, salt);
        dbUsuario.save();
        return res.status(200).json({
            ok: true,
            msg: `El usuario ${dbUsuario.nombre} ha cambiado de contraseña`
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: true,
            msg: `Error conectarse con el servidor`
        });
    }
});
exports.cambiarPassword = cambiarPassword;
/*

  export const deleteUsuario = async (req: Request, res: Response) => {
  
    const { id } = req.params;
    try {
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ msg: 'No existe un usuario con el id ' + id });
        }

        // Verificar si el usuario tiene citas médicas asociadas
        const citas = await CitaMedica.findAll({ where: { rut_paciente: usuario.rut } });

        // Eliminar todas las facturas asociadas a las citas
        for (const cita of citas) {
            await Factura.destroy({ where: { id_cita: cita.idCita } });
            await cita.destroy(); // Elimina la cita después de eliminar las facturas
        }

        // Eliminar historiales médicos del usuario
        await HistorialMedico.destroy({ where: { rut_paciente: usuario.rut } });

        // Eliminar al usuario
        await usuario.destroy();

        res.json({ msg: `Usuario ${usuario.nombre} y todas sus entidades relacionadas han sido eliminados correctamente.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

*/
//# sourceMappingURL=usuario.js.map