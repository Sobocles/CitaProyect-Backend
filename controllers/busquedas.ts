import { Request, Response } from 'express';
import Usuario from '../models/usuario';
import Medico from '../models/medico';
import { Op } from 'sequelize'; // Importa el operador Op para realizar búsquedas avanzadas


export const getTodo = async (req: Request, res: Response) => {
    console.log("ola");
    try {
      const busqueda = req.params.busqueda;
      const regex = new RegExp(busqueda, 'i');
  
      const [usuarios, medicos] = await Promise.all([
        Usuario.findAll({ where: { nombre: { [Op.like]: `%${busqueda}%` } } }),
        Medico.findAll({ where: { nombre: { [Op.like]: `%${busqueda}%` } } }),
      ]);
  
      res.json({
        ok: true,
        resultados: { usuarios, medicos },
      });
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      res.status(500).json({ ok: false, mensaje: 'Error en la búsqueda' });
    }
  };