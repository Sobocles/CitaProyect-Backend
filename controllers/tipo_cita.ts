
import { Request, Response } from 'express';
import TipoCita from '../models/tipo_cita';
import CitaMedica from '../models/cita_medica';
import { Op } from 'sequelize';



export default class tipo_cita {
    private static _instance: tipo_cita;
   

    public static get instance() {
        return this._instance || (this._instance = new tipo_cita());
    }

    getTipoCitas = async (req: Request, res: Response) => {
      try {
          const desde = Number(req.query.desde) || 0;
  
          // Obtén el total de tipo de citas
          const totalTipoCitas = await TipoCita.count();
  
          // Obtén los detalles de todos los tipos de citas con paginación
          const tipo_cita = await TipoCita.findAll({
              offset: desde,
              limit: 5, // o el límite que prefieras
          });
  
          res.json({
              ok: true,
              tipo_cita,
              total: totalTipoCitas
          });
      } catch (error) {
          console.error(error);
          res.status(500).json({
              msg: 'Error en el servidor',
          });
      }
  };
  

        getTipoCita = async( req: Request , res: Response ) => {
            const { id } = req.params;
            console.log('ola');

        try {
            const medico = await TipoCita.findByPk(id);

            if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'Tipo de cita no encontrado',
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

  
        

        crearTipoCita = async (req: Request, res: Response) => {
          let { especialidad_medica } = req.body;
          const tipoCitaData = req.body;
        
          // Quitar acentos y convertir a minúsculas el campo especialidad_medica
          if (especialidad_medica) {
            especialidad_medica = especialidad_medica.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            tipoCitaData.especialidad_medica = especialidad_medica;
          }
          console.log(especialidad_medica);
          
          try {
            // Crea un nuevo tipo de cita
            const nuevoTipoCita = await TipoCita.create(tipoCitaData);
        
            res.json({
              ok: true,
              tipoCita: nuevoTipoCita,
            });
          } catch (error) {
            console.error(error);
            res.status(500).json({
              ok: false,
              msg: 'Hable con el administrador',
            });
          }
        };
        
        
      



          public putTipoCita = async (req: Request, res: Response) => {
            let { especialidad_medica } = req.body;
            const tipoCitaData = req.body;
          
            // Quitar acentos y convertir a minúsculas el campo especialidad_medica
            if (especialidad_medica) {
              especialidad_medica = especialidad_medica.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
              tipoCitaData.especialidad_medica = especialidad_medica;
            }
            console.log(especialidad_medica);
            try {
              const { id } = req.params;
              const { body } = req;
         
        
              // Buscar el médico por su ID
              const medico = await TipoCita.findByPk(id);
        
              if (!medico) {
                return res.status(404).json({
                  ok: false,
                  msg: 'Tipo de cita no encontrado',
                });
              }
        
              // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
              await medico.update(body);
        
              res.json({
                ok: true,
                msg: 'tipo de cita actualizado correctamente',
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
        



          public deleteTipoCita = async (req: Request, res: Response) => {
            const { id } = req.params; // Asegúrate de obtener el ID correctamente
        
            try {
                const tipoCita = await TipoCita.findByPk(id);
                if (!tipoCita) {
                    return res.status(404).json({ message: 'Tipo de cita no encontrado' });
                }
        
                await tipoCita.destroy();
                res.status(200).json({ message: 'Tipo de cita eliminado con éxito' });
            } catch (error) {
                res.status(500).json({ message: 'Error al eliminar el tipo de cita', error });
            }
        };

    getEspecialidades = async(req: Request, res: Response) => {
      try {
          const especialidades = await TipoCita.findAll({
              attributes: ['especialidad_medica'],
              where: {
                  especialidad_medica: {
                      [Op.ne]: null // Esto excluye las entradas donde especialidad_medica es NULL
                  }
              },
              group: ['especialidad_medica']
          });
          
          res.json({ especialidades });
      } catch (error) {
          console.error(error);
          res.status(500).json({
              ok: false,
              msg: 'Hable con el administrador',
          });
      }
    };
    
  
}