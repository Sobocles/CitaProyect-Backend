import jwt from 'jsonwebtoken';


export const generarJWT = (rut: string) => {
  return new Promise<string>((resolve, reject) => {
    const payload = {
      rut,
    };

    jwt.sign(payload, process.env.JWT_SECRET || '', {
      expiresIn: '12h',
    }, (err, token) => {
      if (err) {
        console.error(err);
        reject('No se pudo generar el JWT');
      } else {
        resolve(token || '');
      }
    });
  });
};
