
import { Request, Response } from 'express';
import CitaMedica from '../models/cita_medica';
import Usuario from '../models/usuario';
import Medico from '../models/medico';
import TipoCita from '../models/tipo_cita';
import { Op } from 'sequelize';
import Factura from '../models/factura';

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
  
    
    

  public getCitasMedico = async (req: Request, res: Response) => {
    const { rut_medico } = req.params;
    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;

    try {
        // Contar total de citas para este médico
        const totalCitas = await CitaMedica.count({
            where: {
                rut_medico: rut_medico,
                estado: {
                    [Op.or]: ['en_curso', 'pagado']
                }
            }
        });

        // Obtener las citas con paginación y detalles de paciente y médico
        const citas = await CitaMedica.findAll({
            where: {
                rut_medico: rut_medico,
                estado: {
                    [Op.or]: ['en_curso', 'pagado']
                }
            },
            include: [
                {
                    model: Usuario, // Modelo del paciente
                    as: 'paciente', // Alias del paciente
                    attributes: ['nombre', 'apellidos'] // Atributos del paciente
                },
                {
                    model: Medico, // Modelo del médico
                    as: 'medico', // Alias del médico
                    attributes: ['nombre', 'apellidos'] // Atributos del médico
                }
            ],
            attributes: { exclude: ['rut_paciente', 'rut_medico'] },
            offset: desde,
            limit: limite
        });

        if (!citas || citas.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraron citas para este médico',
            });
        }

        res.json({
            ok: true,
            citas,
            total: totalCitas
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error interno del servidor',
        });
    }
};



getCitaFactura = async (req: Request, res: Response) => {
    const idCita = parseInt(req.params.idCita);
    console.log('AQUI ESTA EL ID DE LA CITA QUE LLEGA AL METODO getCitaFactura', idCita);
    if (!idCita) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Es necesario el ID de la cita médica'
        });
    }

    try {
        const citaMedica = await CitaMedica.findOne({
            where: { idCita },
            include: [
                {
                    model: Factura,
                    as: 'factura',
                    required: false  // Esto es para permitir citas sin factura
                },
                {
                    model: Medico,
                    as: 'medico',
                    attributes: ['nombre', 'apellidos', 'especialidad_medica']  // Solo incluir los atributos necesarios
                },
                {
                    model: Usuario,
                    as: 'paciente',
                    attributes: ['nombre', 'apellidos', 'email']  // Solo incluir los atributos necesarios
                },
                // Puedes incluir más asociaciones si son necesarias
            ]
        });
        console.log('AQUI ESTA LA INFORMACION DE LA CITA MEDICA',citaMedica);

        if (!citaMedica) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Cita médica no encontrada'
            });
        }

        return res.json({
            ok: true,
            citaMedica
        });
    } catch (error) {
      
        if (error instanceof Error) {
            console.error('Error al obtener la cita médica y su factura:', error.message);
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al obtener la cita médica y su factura',
                error: error.message
            });
        } else {
            // 
            console.error('Error inesperado al obtener la cita médica y su factura');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error inesperado al obtener la cita médica y su factura'
            });
        }
    }
};



        

        public crearCita = async( req: Request, res: Response ) => {
          console.log('AQUI ESTA LLEGANDO',req);
          let citaData = req.body.cita; 
      
          console.log('AQUI ESTA LLEGANDO',citaData);

      
          try {
   
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

      crearCitaPaciente = async (req: Request, res: Response) => {
        // Desestructura los datos necesarios del cuerpo de la solicitud
        const { rutMedico, hora_inicio, hora_fin, idTipoCita, especialidad, rutPaciente, fecha } = req.body;
    
        try {
            // Crea la cita médica con el estado no_pagado
            const cita = await CitaMedica.create({
                rut_paciente: rutPaciente,
                rut_medico: rutMedico,
                fecha: fecha, // Asegúrate de que 'fecha' sea una instancia de Date válida
                hora_inicio,
                hora_fin,
                estado: 'no_pagado', // Se establece el estado inicial como no_pagado
                motivo: especialidad, // Usando el campo 'motivo' para almacenar la especialidad
                idTipoCita,
            });
    
            // Sequelize automáticamente añade el ID al objeto 'cita'
            // Devuelve el ID de la cita y cualquier otro dato que desees
            console.log('Cita creada con ID:', cita.idCita);
            return res.status(201).json({
                ok: true,
                cita: {
                    idCita: cita.idCita, // Asegúrate de que 'idCita' sea el nombre correcto de la propiedad en tu modelo
                    // ... otros datos de la cita si son necesarios
                }
            });
        } catch (error) {
            console.error('Error al crear la cita médica:', error);
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear la cita médica',
                error
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