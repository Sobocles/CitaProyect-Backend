import { Request, Response } from 'express';
import Usuario from '../models/usuario';
import Medico from '../models/medico';
import { Op } from 'sequelize'; // Importa el operador Op para realizar búsquedas avanzadas
import HorarioMedic from '../models/horario_medico';
import CitaMedica from '../models/cita_medica';
import TipoCita from '../models/tipo_cita';

export const getDocumentosColeccion = async (req: Request, res: Response) => {
  const tabla = req.params.tabla;
  const busqueda = req.params.busqueda;
    
  let data: any[] = [];

  switch (tabla) {
      case 'usuarios':
          data = await Usuario.findAll({
              attributes: ['rut', 'nombre', 'apellidos', 'email', 'fecha_nacimiento', 'telefono', 'direccion', 'rol'],
              where: {
                  nombre: {
                      [Op.like]: `%${busqueda}%`
                  }
              }
          });
          break;
      
      case 'medicos':
          data = await Medico.findAll({
              attributes: ['rut', 'foto', 'nombre', 'apellidos', 'telefono', 'email', 'direccion', 'nacionalidad', 'especialidad_medica'],
              where: {
                  Nombre: {  // Asumiendo que quieres buscar por nombre en el caso de medicos también
                      [Op.like]: `%${busqueda}%`
                  }
              }
          });
          break;
          case 'horario_medico':
            data = await HorarioMedic.findAll({
                attributes: ['idHorario', 'diaSemana', 'horaInicio', 'horaFinalizacion', 'disponibilidad', 'fechaCreacion'],
                where: {
                    diaSemana: {  // Asumiendo que quieres buscar por día de la semana
                        [Op.like]: `%${busqueda}%`
                    }
                },
                include: [{
                    model: Medico,
                    as: 'medico',
                    attributes: ['nombre','especialidad_medica']  // solo incluir el nombre del médico
                }]
            });
            break;
            case 'cita_medica':
                console.log('AQUI ESTA LA TABLA', tabla);
                console.log('AQUI ESTA LA BUSQUEDA', busqueda);
                data = await CitaMedica.findAll({
                    attributes: ['idCita', 'motivo', 'fecha', 'hora_inicio', 'hora_fin', 'estado'],
                    include: [
                        {
                            model: Usuario,
                            as: 'paciente',
                            attributes: ['nombre'],  // Solo incluir el nombre del paciente
                            required: true
                        },
                        {
                            model: Medico,
                            as: 'medico',
                            attributes: ['nombre'],  // Solo incluir el nombre del médico
                            required: true
                        },
                        {
                            model: TipoCita,
                            as: 'tipoCita', // Este alias debe coincidir con el definido en tus asociaciones
                            attributes: ['especialidad_medica'],
                          }
                          
                    ],
                    where: {
                        [Op.or]: [
                            { '$paciente.nombre$': { [Op.like]: `%${busqueda}%` } },
                            { '$medico.nombre$': { [Op.like]: `%${busqueda}%` } }
                        ]
                    }
                });
                
                break;
            
              case 'tipo_cita':
                  data = await TipoCita.findAll({
                      attributes: ['idTipo', 'tipo_cita', 'precio', 'especialidad_medica', 'color_etiqueta', 'duracion_cita'],
                      where: {
                          especialidad_medica: {
                              [Op.like]: `%${busqueda}%`
                          }
                      }
    });
    break;
          
      default:
          return res.status(400).json({
              ok: false,
              msg: 'Por ahora solo se soporta la búsqueda de usuarios y médicos'
          });
  }
  console.log('aqui'+data);
  res.json({
      ok: true,
      citas: data
  });
}







export const getTodo = async (req: Request, res: Response) => {
    console.log("ola");
    try {
      const busqueda = req.params.busqueda;
      const regex = new RegExp(busqueda, 'i');
  
      const [usuarios, medicos] = await Promise.all([
        Usuario.findAll({ where: { nombre: { [Op.like]: `%${busqueda}%` } } }),
        Medico.findAll({ where: { nombre: { [Op.like]: `%${busqueda}%` } } }),
      ]);
  
      res.json({
        ok: true,
        resultados: { usuarios, medicos },
      });
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      res.status(500).json({ ok: false, mensaje: 'Error en la búsqueda' });
    }
  };