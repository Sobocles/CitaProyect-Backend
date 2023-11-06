
import { Request, Response } from 'express';
import HorarioClinica from '../models/horario_clinica';
import bcrypt from 'bcrypt';
import HorarioMedic from '../models/horario_medico';



export default class Horario_clinica {
    private static _instance: Horario_clinica;

    public static get instance() {
        return this._instance || (this._instance = new Horario_clinica());
    }

    obtenerHorariosClinica = async (req: Request, res: Response) => {
      console.log('ola');
      try {
          const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
          const horariosClinica: any[] = [];
  
          for (const dia of dias) {
              const horarioApertura = await HorarioMedic.min('horaInicio', {
                  where: { diaSemana: dia }
              });
  
              const horarioCierre = await HorarioMedic.max('horaFinalizacion', {
                  where: { diaSemana: dia }
              });
  
              horariosClinica.push({
                  dia,
                  horarioApertura,
                  horarioCierre
              });
          }
  
          return res.json({
              ok: true,
              horariosClinica
          });
  
      } catch (error) {
          console.error(error);
          return res.status(500).json({
              ok: false,
              msg: 'Error inesperado al obtener los horarios. Por favor, revisa los logs.'
          });
      }
  };

        getHorarioClinica = async( req: Request , res: Response ) => {
            const { id } = req.params;

        try {
            const horario_clinica  = await HorarioClinica.findByPk(id);

            if (!horario_clinica ) {
            return res.status(404).json({
                ok: false,
                msg: 'Horario clinica no encontrado',
            });
            }

            res.json({
            ok: true,
            horario_clinica ,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador',
            });
        }
        };

        

        CrearHorarioClinica= async( req: Request, res: Response ) => {
            const horario_clinica = req.body;

            try {
              // Verifica si ya existe un médico con el mismo ID
              const horario_clinica_Existente = await HorarioClinica.findByPk(horario_clinica.id);
          
              if (horario_clinica_Existente) {
                return res.status(400).json({
                  ok: false,
                  msg: 'Ya existe un Horario clinica con el mismo ID',
                });
              }
          
              // Crea un nuevo médico
              const nuevo_horario_clinica = await HorarioClinica.create(horario_clinica);
          
              res.json({
                ok: true,
                historial: nuevo_horario_clinica,
              });
            } catch (error) {
              console.log(error);
              res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador',
              });
            }
          };
      



          public putHorarioClinica = async (req: Request, res: Response) => {
            try {
              const { id } = req.params;
              const { body } = req;
        
              // Buscar el médico por su ID
              const horario_clinica = await HorarioClinica.findByPk(id);
        
              if (!horario_clinica) {
                return res.status(404).json({
                  ok: false,
                  msg: 'Horario clinica no encontrado',
                });
              }
        
              // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
              await horario_clinica.update(body);
        
              res.json({
                ok: true,
                msg: 'Horario clinica actualizado correctamente',
                horario_clinica,
              });
            } catch (error) {
              console.error(error);
              res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador',
              });
            }
          };
        



          public deleteHorarioClinica = async (req: Request, res: Response) => {
            const { id } = req.params;
          
            try {
              const horario_clinica = await HorarioClinica.findByPk(id);
          
              if (!horario_clinica) {
                return res.status(404).json({
                  msg: 'No existe un Horario clinica con el id ' + id,
                });
              }
          
              await horario_clinica.destroy();
          
              res.json({ msg: 'Horario clinica eliminado correctamente' });
            } catch (error) {
              console.error(error);
              res.status(500).json({
                msg: 'Error en el servidor',
              });
            }
         
        }
}