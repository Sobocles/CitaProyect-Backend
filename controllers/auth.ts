import Usuario from '../models/usuario'; // Asegúrate de importar el modelo correcto
import bcrypt from 'bcrypt';

import { Request, Response } from 'express';
import { generarJWT } from '../helpers/generar-jwt';



export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
  console.log(email);
    try {
      // Verificar email
      const usuarioDB = await Usuario.findOne({ where: { email } });
      console.log(usuarioDB);
      if (!usuarioDB) {
        return res.status(404).json({
          ok: false,
          msg: 'Email no encontrado',
        });
      }
  
      // Verificar contraseña
      const validPassword = bcrypt.compareSync(password, usuarioDB.password);
      if (!validPassword) {
        return res.status(400).json({
          ok: false,
          msg: 'Contraseña no válida',
        });
      }
  
      // Generar el TOKEN - JWT
      console.log(usuarioDB.rut);
      const token = await generarJWT(usuarioDB.rut);
  
      res.json({
        ok: true,
        token,
      
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: 'Hable con el administrador',
      });
    }
  };

  export const renewToken = async (req: Request, res: Response) => {

    const rut = (req as any).uid;
    console.log(rut)
    try {
      // Generar el TOKEN - JWT
      const token = await generarJWT(rut);
  
      // Obtener el usuario por UID
      const usuario = await Usuario.findByPk(rut);
  
      if (!usuario) {
        return res.status(404).json({
          ok: false,
          msg: 'Usuario no encontrado',
        });
      }
  
      res.json({
        ok: true,
        token,
        usuario,
     // Se le envía el rol del usuario para revisar sus privilegios (USER_ROLE, ADMIN_ROLE)
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: 'Error al renovar el token',
      });
    }
  };
