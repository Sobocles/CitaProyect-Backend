
import { Request, Response } from 'express';
import CitaMedica from '../models/cita_medica';



export default class Cita {
    private static _instance: Cita;

    public static get instance() {
        return this._instance || (this._instance = new Cita());
    }

        public getCitas= async( req: Request , res: Response ) => {
            const medicos = await CitaMedica.findAll();
            console.log(medicos);
        
            res.json({ medicos });
        }

        public getCita = async( req: Request , res: Response ) => {
            const { id } = req.params;

        try {
            const medico = await CitaMedica.findByPk(id);

            if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'Médico no encontrado',
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
            const medicoData = req.body;

            try {
              // Verifica si ya existe un médico con el mismo ID
              const medicoExistente = await CitaMedica.findByPk(medicoData.id);
          
              if (medicoExistente) {
                return res.status(400).json({
                  ok: false,
                  msg: 'Ya existe un médico con el mismo ID',
                });
              }
          
              // Crea un nuevo médico
              const nuevoMedico = await CitaMedica.create(medicoData);
          
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
      



          public putCita= async (req: Request, res: Response) => {
            try {
              const { id } = req.params;
              const { body } = req;
        
              // Buscar el médico por su ID
              const medico = await CitaMedica.findByPk(id);
        
              if (!medico) {
                return res.status(404).json({
                  ok: false,
                  msg: 'Médico no encontrado',
                });
              }
        
              // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
              await medico.update(body);
        
              res.json({
                ok: true,
                msg: 'Médico actualizado correctamente',
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
        



        public deleteCita = async (req: Request, res: Response) => {

    };
}