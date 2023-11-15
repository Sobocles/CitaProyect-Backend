
import { Request, Response } from 'express';
import HorarioClinica from '../models/horario_clinica';
import bcrypt from 'bcrypt';
import HorarioMedic from '../models/horario_medico';
import InfoClinica from '../models/info-clinica';
import Medico from '../models/medico';

interface HorarioConEspecialidad {
  diaSemana: string;
  'medico.especialidad_medica': string; // Utiliza la notación de cadena para propiedades con puntos
}

export default class Horario_clinica {
    private static _instance: Horario_clinica;

    public static get instance() {
        return this._instance || (this._instance = new Horario_clinica());
    }

    obtenerHorariosClinica = async (req: Request, res: Response) => {
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

       
        getInfoClinica = async (req: Request, res: Response) => {
          console.log('OLLLLLAAAAA');
          try {
            
      
            // Obtén los detalles de todos los médicos
            const Info = await InfoClinica.findAll({
 
            });
        
            res.json({
              ok: true,
              Info,
        
            });
          } catch (error) {
            console.error(error);
            res.status(500).json({
              msg: 'Error en el servidor',
            });
          }
        };

        crearInfoClinica = async (req: Request, res: Response) => {
          try {
              // Verifica si ya existe información de la clínica
              const existeInfo = await InfoClinica.findOne();
              if (existeInfo) {
                  return res.status(400).json({
                      ok: false,
                      msg: 'Ya existe información de la clínica. No se puede crear más de una, si desea cambiar la informacion de la clinica, porfacor elimine la informacion que ya existe e ingrese otra informacion.'
                  });
              }
      
              // Crea la nueva información de la clínica
              const { nombreClinica, direccion, telefono, email } = req.body;

              console.log(nombreClinica, direccion, telefono, email);

              const nuevaInfo = await InfoClinica.create({ nombreClinica, direccion, telefono, email });
              
              res.json({
                  ok: true,
                  msg: 'Información de la clínica creada con éxito',
                  nuevaInfo
              });
          } catch (error) {
              console.error(error);
              res.status(500).json({
                  msg: 'Error en el servidor al crear la información de la clínica'
              });
          }
      };

     
      
      public async obtenerEspecialidadesPorDia(req: Request, res: Response) {
        try {
          const horarios: HorarioConEspecialidad[] = await HorarioMedic.findAll({
            include: [{
              model: Medico,
              attributes: ['especialidad_medica'],
              as: 'medico'
            }],
            attributes: ['diaSemana'],
            group: ['diaSemana', 'medico.especialidad_medica'],
            order: [['diaSemana', 'ASC']],
            raw: true,
          }) as unknown as HorarioConEspecialidad[];
      
          const especialidadesPorDia: {[key: string]: string[]} = {};
          horarios.forEach(horario => {
            const dia = horario.diaSemana;
            const especialidad = horario['medico.especialidad_medica'];
      
            if (!especialidadesPorDia[dia]) {
              especialidadesPorDia[dia] = [];
            }
      
            if (especialidad && !especialidadesPorDia[dia].includes(especialidad)) {
              especialidadesPorDia[dia].push(especialidad);
            }
          });
      
          const ordenDias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
          const especialidadesOrdenadas: {[key: string]: string[]} = {};
      
          ordenDias.forEach(dia => {
            if (especialidadesPorDia[dia]) {
              especialidadesOrdenadas[dia] = especialidadesPorDia[dia];
            }
          });
      
          res.json(especialidadesOrdenadas);
        } catch (error) {
          res.status(500).send({ message: 'Error al obtener las especialidades por día' });
        }
      }
      
    
    
    

      deleteInfoClinica = async (req:Request, res:Response) => {
        try {
          const { id } = req.params; // Obtener el nombre de la clínica del parámetro de la ruta
      
          // Buscar y eliminar la información de la clínica por su nombre
          const resultado = await InfoClinica.destroy({
            where: { id }
          });
      
          if (resultado === 0) {
            return res.status(404).json({
              ok: false,
              mensaje: 'Información de clínica no encontrada'
            });
          }
      
          res.status(200).json({
            ok: true,
            mensaje: 'Información de la clínica eliminada con éxito'
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({
            ok: false,
            mensaje: 'Error al eliminar la información de la clínica'
          });
        }
      };
    

}