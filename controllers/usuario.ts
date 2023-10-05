import { Request, Response } from 'express';
import Usuario from '../models/usuario';
import bcrypt from 'bcrypt';
import { generarJWT } from '../helpers/generar-jwt';

export const getUsuarios = async( req: Request , res: Response ) => {

    const usuarios = await Usuario.findAll();
    console.log(usuarios);

    res.json({ usuarios });
}

export const getUsuario = async( req: Request , res: Response ) => {
    
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);

    if( usuario ){
        res.json(usuario);
    } else {
        res.status(404).json({
            msg: `No existe un usuario con el id ${ id }`
        })
    }

    res.json({
        msg: 'getUsuarios '
    })
}

export const CrearUsuario = async( req: Request, res: Response ) => {
    const { email, password } = req.body;

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
      const token = await generarJWT(usuario.rut);
  
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



export const putUsuario = async (req: Request, res: Response) => {
  const { rut } = req.params;
  const { body } = req;

  try {
    const usuario = await Usuario.findOne({ where: { rut } });

    if (!usuario) {
      return res.status(404).json({
        msg: 'No existe un usuario con el RUT ' + rut,
      });
    }

    // Actualiza los atributos del usuario con los valores proporcionados en el cuerpo de la solicitud
    await usuario.update(body);

    res.json({ usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error en el servidor',
    });
  }
};



export const deleteUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        msg: 'No existe un usuario con el id ' + id,
      });
    }

    await usuario.destroy();

    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error en el servidor',
    });
  }
};
