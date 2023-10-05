import { Request, Response } from 'express';
import Medico from '../models/medico';
import bcrypt from 'bcrypt';
import { generarJWT } from '../helpers/generar-jwt';


export default class HorarioMedico {
    private static _instance: HorarioMedico;

    public static get instance() {
        return this._instance || (this._instance = new HorarioMedico());
    }

        getHorariosMedicos= async( req: Request , res: Response ) => {
            const medicos = await Medico.findAll();
            console.log(medicos);
        
            res.json({ medicos });
        }

        getHorarioMedico = async( req: Request , res: Response ) => {
            const { id } = req.params;

        try {
            const medico = await Medico.findByPk(id);

            if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'Horario medico no encontrado',
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

        

        CrearHorarioMedico = async( req: Request, res: Response ) => {
            const medicoData = req.body;
          console.log(medicoData);
            try {
              // Verifica si ya existe un médico con el mismo ID
              const medicoExistente = await Medico.findByPk(medicoData.id);
          
              if (medicoExistente) {
                return res.status(400).json({
                  ok: false,
                  msg: 'Ya existe un horario con el mismo ID',
                });
              }
          
              // Crea un nuevo médico
              const nuevoMedico = await Medico.create(medicoData);
          
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
        
              // Buscar el médico por su ID
              const medico = await Medico.findByPk(id);
        
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
        



        deleteHorarioMedico = async (req: Request, res: Response) => {

    };
}