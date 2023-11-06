
import { Request, Response } from 'express';
import CitaMedica from '../models/cita_medica';
import Usuario from '../models/usuario';
import Medico from '../models/medico';
import TipoCita from '../models/tipo_cita';

export default class Cita {
    private static _instance: Cita;

    public static get instance() {
        return this._instance || (this._instance = new Cita());
    }
    
    public getCitas = async (req: Request, res: Response) => {
      try {
          const desde = Number(req.query.desde) || 0;
  
          // Obtén el total de citas
          const totalCitas = await CitaMedica.count();
  
          const citas = await CitaMedica.findAll({
              include: [
                  {
                      model: Usuario, // Modelo de Usuario (paciente)
                      as: 'paciente', // Alias definido en la asociación
                      attributes: ['nombre'], // Nombre del paciente
                  },
                  {
                      model: Medico, // Modelo de Usuario (médico)
                      as: 'medico', // Alias definido en la asociación
                      attributes: ['nombre'], // Nombre del médico
                  },
                  {
                      model: TipoCita, // Modelo de TipoCita
                      as: 'tipoCita', // Alias definido en la asociación
                      attributes: ['especialidad_medica'], // Tipo de cita
                  },
              ],
              attributes: ['idCita', 'motivo', 'fecha', 'hora_inicio', 'hora_fin', 'estado'], // Otros atributos de CitaMedica
              offset: desde, // Offset para la paginación
              limit: 5, // Límite de registros por página
          });
  
          res.json({
              ok: true,
              citas,
              total: totalCitas
          });
      } catch (error) {
          console.error('Error al obtener citas:', error);
          res.status(500).json({ error: 'Error al obtener citas' });
      }
  };
  
    
    

        public getCita = async( req: Request , res: Response ) => {
            const { id } = req.params;

        try {
            const medico = await CitaMedica.findByPk(id);

            if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'Cita no encontrado',
            });
            }

            res.json({
            ok: true,
            medico,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
            });
        }
        };

        

        public crearCita = async( req: Request, res: Response ) => {
          console.log('AQUI ESTA LLEGANDO',req);
          let citaData = req.body.cita; // Accede directamente al objeto cita
      
          console.log('AQUI ESTA LLEGANDO',citaData);
              
          // No necesitas reasignar ruts, ya que están presentes en el objeto citaData
          // No necesitas eliminar las propiedades paciente y medico, ya que no están presentes
      
          try {
              // Verifica si ya existe una cita con el mismo ID
              const citaExistente = await CitaMedica.findByPk(citaData.idCita);
                  
              if (citaExistente) {
                  return res.status(400).json({
                      ok: false,
                      msg: 'Ya existe una cita con el mismo ID',
                  });
              }
                  
              // Crea una nueva cita
              const nuevaCita = await CitaMedica.create(citaData);
                  
              res.json({
                  ok: true,
                  cita: nuevaCita,
              });
          } catch (error) {
              console.log(error);
              res.status(500).json({
                  ok: false,
                  msg: 'Hable con el administrador',
              });
          }
      };
      
      
      
      



          public putCita= async (req: Request, res: Response) => {
            try {
              const { id } = req.params;
              const { body } = req;
              console.log('aqui esta el id',id);
              console.log('aqui esta el body',body);
              // Buscar el médico por su ID
              const cita = await CitaMedica.findByPk(id);
        
              if (!cita) {
                return res.status(404).json({
                  ok: false,
                  msg: 'cita no encontrada',
                });
              }
        
              // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
              await cita.update(body);
        
              res.json({
                ok: true,
                msg: 'Médico actualizado correctamente',
                cita,
              });
            } catch (error) {
              console.error(error);
              res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador',
              });
            }
          };
        



          public deleteCita = async (req: Request, res: Response) => {
            const { id } = req.params;
          
            try {
              const cita = await CitaMedica.findByPk(id);
          
              if (!cita) {
                return res.status(404).json({
                  msg: 'No existe un cita con el id ' + id,
                });
              }
          
              await cita.destroy();
          
              res.json({ msg: 'Cita eliminadoa correctamente' });
            } catch (error) {
              console.error(error);
              res.status(500).json({
                msg: 'Error en el servidor',
              });
            }
         
}
}