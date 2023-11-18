
import { Request, Response } from 'express';
import Medico from '../models/medico';
import HorarioMedic from '../models/horario_medico';
import bcrypt from 'bcrypt';
import JwtGenerate from '../helpers/jwt';
import TipoCita from '../models/tipo_cita';
import Factura from '../models/factura';
import CitaMedica from '../models/cita_medica';

export default class Medicos {
    private static _instance: Medicos;

    public static get instance() {
        return this._instance || (this._instance = new Medicos());
    }

    getMedicos = async (req: Request, res: Response) => {
      console.log('Obteniendo médicos...');
      try {
          const desde = Number(req.query.desde) || 0;
  
          // Obtén el total de médicos activos
          const totalMedicos = await Medico.count({
              where: {
                  estado: 'activo' // Contar solo médicos activos
              }
          });
  
          // Obtén los detalles de todos los médicos activos
          const medicos = await Medico.findAll({
              where: {
                  estado: 'activo' // Filtrar por médicos activos
              },
              offset: desde,
              limit: 5,
          });
  
          res.json({
              ok: true,
              medicos,
              total: totalMedicos
          });
      } catch (error) {
          console.error('Error al obtener los médicos:', error);
          res.status(500).json({
              msg: 'Error en el servidor',
          });
      }
  };
  

    /*
          getMedicos = async (req: Request, res: Response) => {

      console.log('olaaaaaa');
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



    */

    getMedicosEspecialidad = async (req: Request, res: Response) => {
      try {
          // Obtener todas las especialidades válidas de TipoCita
          const especialidadesValidas = await TipoCita.findAll({
              attributes: ['especialidad_medica']
          });
          const especialidades = especialidadesValidas.map(ec => ec.especialidad_medica);
  
          // Obtener todos los médicos activos
          const medicos = await Medico.findAll({
              attributes: ['rut', 'nombre', 'apellidos', 'especialidad_medica'],
              where: {
                  estado: 'activo' // Agregar condición para filtrar solo médicos activos
              }
          });
  
          // Filtrar los médicos que tienen una especialidad válida
          const medicosFiltrados = medicos.filter(medico => 
              especialidades.includes(medico.especialidad_medica)
          );
  
          res.json({
              ok: true,
              medicos: medicosFiltrados
          });
      } catch (error) {
          console.error('Error al obtener los médicos y sus especialidades:', error);
          res.status(500).json({
              ok: false,
              msg: 'Error en el servidor'
          });
      }
  };
  
/*
    getMedicosEspecialidad = async (req: Request, res: Response) => {
      try {
        // Obtener todas las especialidades válidas de TipoCita
        const especialidadesValidas = await TipoCita.findAll({
          attributes: ['especialidad_medica']
        });
        const especialidades = especialidadesValidas.map(ec => ec.especialidad_medica);
    
        // Obtener todos los médicos
        const medicos = await Medico.findAll({
          attributes: ['rut', 'nombre', 'apellidos', 'especialidad_medica']
        });
    
        // Filtrar los médicos que tienen una especialidad no válida
        const medicosFiltrados = medicos.filter(medico => 
          especialidades.includes(medico.especialidad_medica)
        );
    
        res.json({
          ok: true,
          medicos: medicosFiltrados
        });
      } catch (error) {
        console.error('Error al obtener los médicos y sus especialidades:', error);
        res.status(500).json({
          ok: false,
          msg: 'Error en el servidor'
        });
      }
    };
*/


getAllMedicos = async (req: Request, res: Response) => {
  console.log('olaaaaaa aquí');
  try {
      // Obtén el total de médicos activos
      const totalMedicosActivos = await Medico.count({
          where: { estado: 'activo' } // Filtra por estado activo
      });

      // Obtén los detalles de todos los médicos activos
      const medicosActivos = await Medico.findAll({
          where: { estado: 'activo' } // Filtra por estado activo
      });

      res.json({
          ok: true,
          medicos: medicosActivos,
          total: totalMedicosActivos
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          msg: 'Error en el servidor',
      });
  }
};

/*
    getAllMedicos = async (req: Request, res: Response) => {
      console.log('olaaaaaa aquii');
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
*/    

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
          const { email, password, rut, telefono, ...medicoData } = req.body;
      
          try {
              // Verificar si el correo ya está registrado por un médico activo
              const existeEmailMedico = await Medico.findOne({ 
                  where: { 
                      email,
                      estado: 'activo' // Solo busca entre médicos activos
                  } 
              });
      
              if (existeEmailMedico) {
                  return res.status(400).json({
                      ok: false,
                      msg: 'El correo ya está registrado para otro médico',
                  });
              }
      
              // Verificar si el RUT ya está registrado por un médico activo
              const existeRutMedico = await Medico.findOne({ 
                  where: { 
                      rut,
                      estado: 'activo' // Solo busca entre médicos activos
                  } 
              });
      
              if (existeRutMedico) {
                  return res.status(400).json({
                      ok: false,
                      msg: 'El RUT ya está registrado para otro médico',
                  });
              }
      
              // Verificar si el teléfono ya está registrado por un médico activo
              const existeTelefonoMedico = await Medico.findOne({ 
                  where: { 
                      telefono,
                      estado: 'activo' // Solo busca entre médicos activos
                  } 
              });
      
              if (existeTelefonoMedico) {
                  return res.status(400).json({
                      ok: false,
                      msg: 'El número de teléfono ya está registrado para otro médico',
                  });
              }
      
              // Encriptar contraseña
              const saltRounds = 10;
              const hashedPassword = await bcrypt.hash(password, saltRounds);
      
              // Crea un nuevo médico
              const nuevoMedico = await Medico.create({
                  ...medicoData,
                  email,
                  rut,
                  telefono,
                  password: hashedPassword,
                  rol: 'MEDICO_ROLE' 
              });
      
              // Genera el JWT
              const token = await JwtGenerate.instance.generarJWT(nuevoMedico.rut, nuevoMedico.nombre, nuevoMedico.apellidos, nuevoMedico.rol);
      
              res.json({
                  ok: true,
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
      
/*
        
        CrearMedico = async(req: Request, res: Response) => {
          const { email, password, rut, telefono, ...medicoData } = req.body;
      
          try {
              // Verificar si el correo ya está registrado en la tabla de médicos
              const existeEmailMedico = await Medico.findOne({ where: { email } });
      
              if (existeEmailMedico) {
                  return res.status(400).json({
                      ok: false,
                      msg: 'El correo ya está registrado para otro médico',
                  });
              }
      
              // Verificar si el RUT ya está registrado en la tabla de médicos
              const existeRutMedico = await Medico.findOne({ where: { rut } });
      
              if (existeRutMedico) {
                  return res.status(400).json({
                      ok: false,
                      msg: 'El RUT ya está registrado para otro médico',
                  });
              }
      
              // Verificar si el teléfono ya está registrado en la tabla de médicos
              const existeTelefonoMedico = await Medico.findOne({ where: { telefono } });
      
              if (existeTelefonoMedico) {
                  return res.status(400).json({
                      ok: false,
                      msg: 'El número de teléfono ya está registrado para otro médico',
                  });
              }
      
              // Encriptar contraseña
              const saltRounds = 10; // Número de rondas de cifrado
              const hashedPassword = await bcrypt.hash(password, saltRounds);
              
              // Crea un nuevo médico
              const nuevoMedico = await Medico.create({
                  ...medicoData,
                  email,
                  rut,
                  telefono,
                  password: hashedPassword,
                  rol: 'MEDICO_ROLE' 
              });
      
              // Genera el JWT
              const token = await JwtGenerate.instance.generarJWT(nuevoMedico.rut, nuevoMedico.nombre, nuevoMedico.apellidos, nuevoMedico.rol);
      
              res.json({
                  ok: true,
                  msg: "Registro completado con éxito. El médico ahora está habilitado para autenticarse y acceder al sistema con sus credenciales asignadas en la pantalla de login.",
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
   */   
      
      
      



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
            console.log('AQUI ESTA EL RUT DEL MEDICO', rut);
        
            try {
                const medico = await Medico.findByPk(rut);
        
                if (!medico) {
                    return res.status(404).json({
                        msg: 'No existe un médico con el rut ' + rut,
                    });
                }
        
                // Encuentra todas las citas médicas asociadas al médico
                const citas = await CitaMedica.findAll({ where: { rut_medico: medico.rut } });
        
                // Cambia el estado de actividad de las citas médicas a "inactivo"
                for (const cita of citas) {
                    await cita.update({ estado_actividad: 'inactivo' });
                }
        
                // Cambiar el estado del médico a inactivo
                await medico.update({ estado: 'inactivo' });
        
                res.json({ msg: 'Médico y sus citas médicas asociadas actualizadas a estado inactivo.' });
            } catch (error) {
                console.error(error);
                res.status(500).json({ msg: 'Error en el servidor' });
            }
        };
        
        
/*
    public deleteMedico = async (req: Request, res: Response) => {
            const { rut } = req.params;
            console.log('AQUI ESTA EL RUT DEL MEDICO',rut);
          
            try {
              const medico = await Medico.findByPk(rut);
          
              if (!medico) {
                return res.status(404).json({
                  msg: 'No existe un médico con el id ' + rut,
                });
              }
          
              // Eliminar los horarios relacionados con el médico
              await HorarioMedic.destroy({
                where: { rut_medico: medico.rut }, // Asumiendo que el campo se llama "rutMedico"
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


*/
        
          
 };
