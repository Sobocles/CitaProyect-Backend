import { Request, Response } from 'express';
import Usuario from '../models/usuario';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

import JwtGenerate from '../helpers/jwt';
import HistorialMedico from '../models/historial_medico';
import CitaMedica from '../models/cita_medica';




export const getUsuarios = async (req: Request, res: Response) => {
  try {
      const desde = Number(req.query.desde) || 0;

      // Obtén el total de usuarios
      const totalUsuarios = await Usuario.count();

      // Obtén los detalles de todos los usuarios con paginación y sin mostrar campos sensibles
      const usuarios = await Usuario.findAll({
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
  } catch (error) {
      console.error(error);
      res.status(500).send('Error interno del servidor');
  }
};

// Método para obtener a todos los pacientes
export const getAllUsuarios = async (req: Request, res: Response) => {
  console.log('olaaaaaaaaaaaaa');
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


export const getPacientesConCitasPagadasYEnCurso = async (req: Request, res: Response) => {
  try {
      // Obtén los detalles de los pacientes con citas en estado 'en_curso' y que estén marcadas como 'pagadas'
      const pacientesConCitasPagadas = await CitaMedica.findAll({
          where: {
            estado: ['en_curso', 'no_asistido']
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




export const getUsuario = async( req: Request , res: Response ) => {
    
  const { id } = req.params;

  const usuario = await Usuario.findByPk(id);

  if( usuario ){
      return res.json(usuario);
  }

  return res.status(404).json({
      msg: `No existe un usuario con el id ${ id }`
  });
}

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
  
  export const putUsuario = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      let { body } = req;
  
      // Buscar el usuario por su ID
      const usuario = await Usuario.findByPk(id);
  
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
      await usuario.update(body);
  
      res.json({
        usuario,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        ok: false,
        msg: 'Hable con el administrador',
      });
    }
  };
  


export const deleteUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);
  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        msg: 'No existe un usuario con el id ' + id,
      });
    }

    // Antes de eliminar al usuario, elimina los registros de historial relacionados
    await HistorialMedico.destroy({
      where: { rut_paciente: usuario.rut }, // Asumiendo que el campo se llama "rut_usuario"
    });

    // Ahora puedes eliminar al usuario
    await usuario.destroy();

    res.json({ msg: 'Usuario y sus registros de historial eliminados correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error en el servidor',
    });
  }
};

