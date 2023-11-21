"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodo = exports.getDocumentosColeccion = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const medico_1 = __importDefault(require("../models/medico"));
const sequelize_1 = require("sequelize"); // Importa el operador Op para realizar búsquedas avanzadas
const horario_medico_1 = __importDefault(require("../models/horario_medico"));
const cita_medica_1 = __importDefault(require("../models/cita_medica"));
const tipo_cita_1 = __importDefault(require("../models/tipo_cita"));
const factura_1 = __importDefault(require("../models/factura"));
const getDocumentosColeccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    let data = [];
    switch (tabla) {
        case 'usuarios':
            data = yield usuario_1.default.findAll({
                attributes: ['rut', 'nombre', 'apellidos', 'email', 'fecha_nacimiento', 'telefono', 'direccion', 'rol'],
                where: {
                    nombre: {
                        [sequelize_1.Op.like]: `%${busqueda}%`
                    },
                    estado: 'activo' // Añade esta línea para filtrar solo usuarios activos
                }
            });
            break;
        case 'medicos':
            data = yield medico_1.default.findAll({
                attributes: ['rut', 'foto', 'nombre', 'apellidos', 'telefono', 'email', 'direccion', 'nacionalidad', 'especialidad_medica'],
                where: {
                    [sequelize_1.Op.and]: [
                        { nombre: { [sequelize_1.Op.like]: `%${busqueda}%` } },
                        { estado: 'activo' } // Filtrar solo médicos activos
                    ]
                }
            });
            break;
        case 'horario_medico':
            data = yield horario_medico_1.default.findAll({
                attributes: ['idHorario', 'diaSemana', 'horaInicio', 'horaFinalizacion', 'disponibilidad', 'fechaCreacion'],
                where: {
                    diaSemana: { [sequelize_1.Op.like]: `%${busqueda}%` }
                },
                include: [{
                        model: medico_1.default,
                        as: 'medico',
                        attributes: ['nombre', 'apellidos', 'especialidad_medica'],
                        where: { estado: 'activo' } // Filtrar solo médicos activos
                    }]
            });
            break;
        case 'cita_medica':
            data = yield cita_medica_1.default.findAll({
                attributes: ['idCita', 'motivo', 'fecha', 'hora_inicio', 'hora_fin', 'estado'],
                include: [
                    {
                        model: usuario_1.default,
                        as: 'paciente',
                        attributes: ['nombre'],
                        required: true
                    },
                    {
                        model: medico_1.default,
                        as: 'medico',
                        attributes: ['nombre'],
                        required: true
                    },
                    {
                        model: tipo_cita_1.default,
                        as: 'tipoCita',
                        attributes: ['especialidad_medica'],
                    }
                ],
                where: {
                    [sequelize_1.Op.and]: [
                        {
                            [sequelize_1.Op.or]: [
                                { '$paciente.nombre$': { [sequelize_1.Op.like]: `%${busqueda}%` } },
                                { '$medico.nombre$': { [sequelize_1.Op.like]: `%${busqueda}%` } }
                            ]
                        },
                        { estado_actividad: 'activo' } // Añadir esta línea para filtrar solo citas activas
                    ]
                }
            });
            break;
        case 'tipo_cita':
            data = yield tipo_cita_1.default.findAll({
                attributes: ['idTipo', 'tipo_cita', 'precio', 'especialidad_medica', 'duracion_cita'],
                where: {
                    especialidad_medica: {
                        [sequelize_1.Op.like]: `%${busqueda}%`
                    }
                }
            });
            break;
        case 'facturas':
            data = yield factura_1.default.findAll({
                include: [{
                        model: cita_medica_1.default,
                        as: 'citaMedica',
                        include: [
                            {
                                model: usuario_1.default,
                                as: 'paciente',
                                attributes: ['rut', 'nombre', 'apellidos'],
                                where: {
                                    nombre: {
                                        [sequelize_1.Op.like]: `%${busqueda}%`
                                    }
                                },
                                required: true
                            },
                            {
                                model: medico_1.default,
                                as: 'medico',
                                attributes: ['rut', 'nombre', 'apellidos']
                            }
                        ],
                        attributes: ['motivo']
                    }],
                attributes: ['id_factura', 'payment_method_id', 'transaction_amount', 'monto_pagado', 'fecha_pago']
            });
            break;
        case 'cita_medico':
            data = yield cita_medica_1.default.findAll({
                attributes: ['idCita', 'motivo', 'fecha', 'hora_inicio', 'hora_fin', 'estado'],
                include: [
                    {
                        model: usuario_1.default,
                        as: 'paciente',
                        attributes: ['nombre'],
                        required: true,
                        where: {
                            estado: 'activo' // Asegúrate de que los pacientes estén activos
                        }
                    },
                    {
                        model: medico_1.default,
                        as: 'medico',
                        attributes: ['nombre'],
                        required: true,
                        where: {
                            estado: 'activo' // Asegúrate de que los médicos estén activos
                        }
                    },
                    {
                        model: tipo_cita_1.default,
                        as: 'tipoCita',
                        attributes: ['especialidad_medica'],
                    }
                ],
                where: {
                    [sequelize_1.Op.or]: [
                        { '$paciente.nombre$': { [sequelize_1.Op.like]: `%${busqueda}%` } },
                        { '$medico.nombre$': { [sequelize_1.Op.like]: `%${busqueda}%` } }
                    ],
                    estado_actividad: 'activo' // Añadir esta línea para filtrar solo citas activas
                }
            });
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'Por ahora solo se soporta la búsqueda de usuarios y médicos'
            });
    }
    res.json({
        ok: true,
        citas: data
    });
});
exports.getDocumentosColeccion = getDocumentosColeccion;
/*
export const getDocumentosColeccion = async (req: Request, res: Response) => {
  const tabla = req.params.tabla;
  const busqueda = req.params.busqueda;
  console.log('aqui esta la tabla', tabla);
  console.log('aqui esta la busqueda',busqueda);
    
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
                      attributes: ['idTipo', 'tipo_cita', 'precio', 'especialidad_medica', 'duracion_cita'],
                      where: {
                          especialidad_medica: {
                              [Op.like]: `%${busqueda}%`
                          }
                      }
    });
    break;
    case 'facturas':
          data = await Factura.findAll({
              include: [{
                  model: CitaMedica,
                  as: 'citaMedica',
                  include: [
                      {
                          model: Usuario,
                          as: 'paciente',
                          attributes: ['rut', 'nombre', 'apellidos'],
                          where: {
                              nombre: {
                                  [Op.like]: `%${busqueda}%`
                              }
                          },
                          required: true
                      },
                      {
                          model: Medico,
                          as: 'medico',
                          attributes: ['rut', 'nombre', 'apellidos']
                      }
                  ],
                  attributes: ['motivo']
              }],
              attributes: ['id_factura', 'payment_method_id', 'transaction_amount', 'monto_pagado', 'fecha_pago']
          });
          break;
          
      default:
          return res.status(400).json({
              ok: false,
              msg: 'Por ahora solo se soporta la búsqueda de usuarios y médicos'
          });
  }
  console.log('aqui factura',data);
  res.json({
      ok: true,
      citas: data
  });
}

*/
const getTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("ola");
    try {
        const busqueda = req.params.busqueda;
        const regex = new RegExp(busqueda, 'i');
        const [usuarios, medicos] = yield Promise.all([
            usuario_1.default.findAll({ where: { nombre: { [sequelize_1.Op.like]: `%${busqueda}%` } } }),
            medico_1.default.findAll({ where: { nombre: { [sequelize_1.Op.like]: `%${busqueda}%` } } }),
        ]);
        res.json({
            ok: true,
            resultados: { usuarios, medicos },
        });
    }
    catch (error) {
        console.error('Error en la búsqueda:', error);
        res.status(500).json({ ok: false, mensaje: 'Error en la búsqueda' });
    }
});
exports.getTodo = getTodo;
//# sourceMappingURL=busquedas.js.map