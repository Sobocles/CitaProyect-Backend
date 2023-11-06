import { Request, Response } from 'express';
import Medico from '../models/medico';
import bcrypt from 'bcrypt';
import HorarioMedic from '../models/horario_medico';


export default class HorarioMedico {
    private static _instance: HorarioMedico;

    public static get instance() {
        return this._instance || (this._instance = new HorarioMedico());
    }


/* 
      idHorario!: number; // El signo de interrogación indica que es opcional, ya que se autoincrementa en la base de datos
  diaSemana!: string;
  horaInicio!: string;
  horaFinalizacion!: string;
  hora_inicio_colacion?: string;
  hora_fin_colacion?: string;
  duracionCitas!: number;
  rut_medico!: string;
  disponibilidad!: boolean;
  fechaCreacion!: Date;
  }


*/

getHorariosMedicos = async (req: Request, res: Response) => {
  try {
      const desde = Number(req.query.desde) || 0;

      // Obtén el total de horarios de médicos
      const totalHorarios = await HorarioMedic.count();

      // Obtén los detalles de todos los horarios de médicos con paginación
      const horarios = await HorarioMedic.findAll({
          include: [
              {
                  model: Medico, 
                  as: 'medico', 
                  attributes: ['nombre','especialidad_medica'],
              },
          ],
          offset: desde,
          limit: 5,
      });

      res.json({
          ok: true,
          horarios,
          total: totalHorarios,
      });
  } catch (error) {
      console.error('Error al obtener horario:', error);
      res.status(500).json({
          msg: 'Error en el servidor',
      });
  }
};


        getHorarioMedico = async( req: Request , res: Response ) => {
          const { id } = req.params;
          console.log(10);

      try {
          const horario = await HorarioMedic.findByPk(id);

          if (!horario) {
          return res.status(404).json({
              ok: false,
              msg: 'Médico no encontrado',
          });
          }

          res.json({
          ok: true,
          horario,
          });
      } catch (error) {
          console.log(error);
          res.status(500).json({
          ok: false,
          msg: 'Hable con el administrador',
          });
      }
      };

        

        CrearHorarioMedico = async( req: Request, res: Response ) => {
            const medicoData = req.body;
          console.log(medicoData);
            try {
              // Verifica si ya existe un médico con el mismo ID
              const medicoExistente = await HorarioMedic.findByPk(medicoData.id);
          
              if (medicoExistente) {
                return res.status(400).json({
                  ok: false,
                  msg: 'Ya existe un horario con el mismo ID',
                });
              }
          
              // Crea un nuevo médico
              const nuevoMedico = await HorarioMedic.create(medicoData);
          
              res.json({
                ok: true,
                medico: nuevoMedico,
              });
            } catch (error) {
              console.log(error);
              res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador',
              });
            }
          };
      



          public putHorarioMedico = async (req: Request, res: Response) => {
            try {
              const { id } = req.params;
              const { body } = req;
              console.log(body);
        
              // Buscar el médico por su ID
              const medico = await HorarioMedic.findByPk(id);
        
              if (!medico) {
                return res.status(404).json({
                  ok: false,
                  msg: 'Horario medico no encontrado',
                });
              }
        
              // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
              await medico.update(body);
        
              res.json({
                ok: true,
                msg: 'Horario medico actualizado correctamente',
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
        



          public deleteHorarioMedico = async (req: Request, res: Response) => {
            const { id } = req.params;
          
            try {
              const usuario = await HorarioMedic.findByPk(id);
          
              if (!usuario) {
                return res.status(404).json({
                  msg: 'No existe un horario medico con el id ' + id,
                });
              }
          
              await usuario.destroy();
          
              res.json({ msg: 'horario medico eliminado correctamente' });
            } catch (error) {
              console.error(error);
              res.status(500).json({
                msg: 'Error en el servidor',
              });
            }
         
}
}