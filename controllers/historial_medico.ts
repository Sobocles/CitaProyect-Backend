
import { Request, Response } from 'express';
import HistorialMedico from '../models/historial_medico';
import bcrypt from 'bcrypt';
import Medico from '../models/medico';



export default class Historial_Medico {
    private static _instance: Historial_Medico;

    public static get instance() {
        return this._instance || (this._instance = new Historial_Medico());
    }

        getHistoriales= async( req: Request , res: Response ) => {
            const historial = await HistorialMedico.findAll();
            console.log(historial);
        
            res.json({ historial });
        }

        getHistorial = async (req: Request, res: Response) => {
          const { id } = req.params; // ID del paciente
          const desde = Number(req.query.desde) || 0;
          const limite = Number(req.query.limite) || 5;
      
          try {
              // Contar total de historiales para este paciente
              const totalHistoriales = await HistorialMedico.count({
                  where: { rut_paciente: id }
              });
      
              // Si no hay historiales, devuelve una respuesta vacía
              if (totalHistoriales === 0) {
                  return res.status(200).json({
                      ok: true,
                      msg: 'No hay historiales para el paciente',
                      historiales: []
                  });
              }
      
              // Obtener los historiales con paginación e incluir el médico activo
              const historiales = await HistorialMedico.findAll({
                  where: { rut_paciente: id },
                  include: [{
                      model: Medico,
                      as: 'medico', // Asegúrate de que 'as' coincida con cómo definiste la relación
                      where: { estado: 'activo' },
                      attributes: ['nombre', 'apellidos'] // Atributos a incluir del médico
                  }],
                  offset: desde,
                  limit: limite,
                  attributes: { exclude: ['rut_medico'] } // Excluye 'rut_medico' si no quieres mostrarlo
              });
      
              res.json({
                  ok: true,
                  historiales, // Devuelve los historiales médicos paginados junto con el médico activo
                  total: totalHistoriales // Total de historiales
              });
          } catch (error) {
              console.log(error);
              res.status(500).json({
                  ok: false,
                  msg: 'Hable con el administrador',
              });
          }
      };
      
      

        

        CrearHistorial= async( req: Request, res: Response ) => {
            const historialData = req.body;

            try {
              // Verifica si ya existe un médico con el mismo ID
              const historialExistente = await HistorialMedico.findByPk(historialData.id);
          
              if (historialExistente) {
                return res.status(400).json({
                  ok: false,
                  msg: 'Ya existe un historial con el mismo ID',
                });
              }
          
              // Crea un nuevo médico
              const nuevoHistorial = await HistorialMedico.create(historialData);
          
              res.json({
                ok: true,
                historial: nuevoHistorial,
              });
            } catch (error) {
              console.log(error);
              res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador',
              });
            }
          };
      



          public putHistorial = async (req: Request, res: Response) => {
            try {
              const { id } = req.params;
              const { body } = req;
        
              // Buscar el médico por su ID
              const medico = await HistorialMedico.findByPk(id);
        
              if (!medico) {
                return res.status(404).json({
                  ok: false,
                  msg: 'Historial no encontrado no encontrado',
                });
              }
        
              // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
              await medico.update(body);
        
              res.json({
                ok: true,
                msg: 'historial actualizado correctamente',
                medico,
              });
            } catch (error) {
              console.error(error);
              res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador',
              });
            }
          };
        



          public deleteHistorial = async (req: Request, res: Response) => {
            const { id } = req.params;
          
            try {
              const usuario = await HistorialMedico.findByPk(id);
          
              if (!usuario) {
                return res.status(404).json({
                  msg: 'No existe un historial con el id ' + id,
                });
              }
          
              await usuario.destroy();
          
              res.json({ msg: 'historial eliminado correctamente' });
            } catch (error) {
              console.error(error);
              res.status(500).json({
                msg: 'Error en el servidor',
              });
            }
         
        }
}