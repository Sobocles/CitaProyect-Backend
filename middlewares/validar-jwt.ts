import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Secret } from 'jsonwebtoken';


// Define una interfaz personalizada que describe la estructura de req
interface CustomRequest extends Request {
  rut?: string; // Hacemos 'uid' opcional para evitar errores de tipo
}

const validarJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
  // Leer el Token
  const token = req.header('x-token');
  console.log(token);

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No hay token en la petición'
    });
  }

  try {
    const { rut }: any = jwt.verify(token, process.env.JWT_SECRET as string);

    console.log(rut);
    req.rut = rut;

    next();

  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no válido'
    });
  }
};

export default validarJWT;
