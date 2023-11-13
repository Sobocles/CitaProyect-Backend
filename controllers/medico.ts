
import { Request, Response } from 'express';
import Medico from '../models/medico';
import HorarioMedic from '../models/horario_medico';
import bcrypt from 'bcrypt';
import JwtGenerate from '../helpers/jwt';
import TipoCita from '../models/tipo_cita';

export default class Medicos {
    private static _instance: Medicos;

    public static get instance() {
        return this._instance || (this._instance = new Medicos());
    }

    getMedicos = async (req: Request, res: Response) => {
      try {
        const desde = Number(req.query.desde) || 0;
    
        // Obtén el total de médicos
        const totalMedicos = await Medico.count();
    
        // Obtén los detalles de todos los médicos
        const medicos = await Medico.findAll({
   // Filtras los campos que deseas
          offset: desde,
          limit: 5,
        });
    
        res.json({
          ok: true,
          medicos,
          total: totalMedicos
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          msg: 'Error en el servidor',
        });
      }
    };

    getAllMedicos = async (req: Request, res: Response) => {
      try {
        // Obtén el total de médicos
        const totalMedicos = await Medico.count();
    
        // Obtén los detalles de todos los médicos
        const medicos = await Medico.findAll();
    
        res.json({
          ok: true,
          medicos,
          total: totalMedicos
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          msg: 'Error en el servidor',
        });
      }
    };
    

        getMedico = async( req: Request , res: Response ) => {
            const { rut } = req.params;
        
        try {
            const medico = await Medico.findByPk(rut);

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

        
        CrearMedico = async(req: Request, res: Response) => {
          const { email, password, ...medicoData } = req.body;
      
          try {
              // Verificar si el correo ya está registrado en la tabla de médicos
              const existeEmailMedico = await Medico.findOne({ where: { email } });
      
              if (existeEmailMedico) {
                  return res.status(400).json({
                      ok: false,
                      msg: 'El correo ya está registrado para otro médico',
                  });
              }
      
              // Encriptar contraseña
              const saltRounds = 10; // Número de rondas de cifrado
              const hashedPassword = await bcrypt.hash(password, saltRounds);
              
              // Crea un nuevo médico
              const nuevoMedico = await Medico.create({
                  ...medicoData,
                  email: email,
                  password: hashedPassword,
                  rol: 'MEDICO_ROLE' 
              });
      
              // Genera el JWT
              const token = await JwtGenerate.instance.generarJWT(nuevoMedico.rut, nuevoMedico.nombre, nuevoMedico.apellidos, nuevoMedico.rol);
      
              res.json({
                  ok: true,
                  msg: "Medico creado exitosamente",
                  medico: nuevoMedico,
                  token
              });
          } catch (error) {
              console.log(error);
              res.status(500).json({
                  ok: false,
                  msg: 'Hable con el administrador',
              });
          }
      };
      
      
      



          public putMedico = async (req: Request, res: Response) => {
            try {
              const { rut } = req.params;
              const { body } = req;
              console.log('aqui esta el rut',rut);
              // Buscar el médico por su ID
              const medico = await Medico.findByPk(rut);
        
              if (!medico) {
                return res.status(404).json({
                  ok: false,
                  msg: 'Médico no encontrado',
                });
              }
        
              // Actualizar los campos del médico con los valores proporcionados en el cuerpo de la solicitud
              await medico.update(body);
        
              res.json({
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
        



          public deleteMedico = async (req: Request, res: Response) => {
            const { rut } = req.params;
          
            try {
              const medico = await Medico.findByPk(rut);
          
              if (!medico) {
                return res.status(404).json({
                  msg: 'No existe un médico con el id ' + rut,
                });
              }
          
              // Eliminar los horarios relacionados con el médico
              await HorarioMedic.destroy({
                where: { rutMedico: medico.rut }, // Asumiendo que el campo se llama "rutMedico"
              });
          
              // Ahora puedes eliminar al médico
              await medico.destroy();
          
              res.json({ msg: 'Médico y sus horarios eliminados correctamente' });
            } catch (error) {
              console.error(error);
              res.status(500).json({
                msg: 'Error en el servidor',
              });
            }
          }

        
          
 };
