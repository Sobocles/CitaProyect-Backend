
import { Request, Response } from 'express';
import TipoCitaMedica from '../models/tipo_cita';



export default class tipo_cita {
    private static _instance: tipo_cita;

    public static get instance() {
        return this._instance || (this._instance = new tipo_cita());
    }

        getTipoCitas= async( req: Request , res: Response ) => {
            const medicos = await TipoCitaMedica.findAll();
            console.log(medicos);
        
            res.json({ medicos });
        }

        getTipoCita = async( req: Request , res: Response ) => {
            const { id } = req.params;

        try {
            const medico = await TipoCitaMedica.findByPk(id);

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

        

        crearTipoCita = async( req: Request, res: Response ) => {
            const medicoData = req.body;
            console.log(medicoData);
            try {
              // Verifica si ya existe un médico con el mismo ID
              const medicoExistente = await TipoCitaMedica.findByPk(medicoData.id);
          
              if (medicoExistente) {
                return res.status(400).json({
                  ok: false,
                  msg: 'Ya existe un tipo de cita con el mismo ID',
                });
              }
          
              // Crea un nuevo médico
              const nuevoMedico = await TipoCitaMedica.create(medicoData);
          
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
      



          public putTipoCita = async (req: Request, res: Response) => {
            try {
              const { id } = req.params;
              const { body } = req;
        
              // Buscar el médico por su ID
              const medico = await TipoCitaMedica.findByPk(id);
        
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
        



        deleteTipoCita= async (req: Request, res: Response) => {

    };
}