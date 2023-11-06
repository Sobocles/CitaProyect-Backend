
import { Request, Response } from 'express';
import HistorialMedico from '../models/historial_medico';
import bcrypt from 'bcrypt';



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

        getHistorial = async( req: Request , res: Response ) => {
          const { id } = req.params; // Puesto que tu ruta tiene '/:id'
          const rut_paciente = id;
          console.log('historiales',rut_paciente);
      
          try {
              const historiales = await HistorialMedico.findAll({ where: { rut_paciente } });
              if (historiales.length === 0) {
                return res.status(200).json({
                    ok: true,
                    msg: 'No hay historiales para el paciente',
                    historiales: [] // Devuelve un arreglo vacío
                });
            }
      
              if (historiales.length === 0) {
                  return res.status(404).json({
                      ok: false,
                      msg: 'Historiales no encontrados para el paciente',
                  });
              }
      
              res.json({
                  ok: true,
                  historiales, // Devuelve todos los historiales médicos
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