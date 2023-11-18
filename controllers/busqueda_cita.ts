import { Op } from 'sequelize';
import Medico from '../models/medico';
import HorarioMedic from '../models/horario_medico';
import TipoCita from '../models/tipo_cita';
import horario_clinica from '../models/horario_clinica';
import { Request, Response } from 'express';
import CitaMedica from '../models/cita_medica';


// Funciones Auxiliares:
function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
    const hh = Math.floor(minutes / 60).toString().padStart(2, '0');
    const mm = (minutes % 60).toString().padStart(2, '0');
    return `${hh}:${mm}`;
}

function numberToDay(dayNumber: number): string {
    const days = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    return days[dayNumber];
}

// Controlador principal:
// Controlador principal:
export const buscarmedico = async (req: Request, res: Response) => {
    const { especialidad, fecha } = req.body;
    console.log(especialidad, fecha);

    // Convertimos la fecha de entrada a un objeto Date de JavaScript
    const fechaIngresada = new Date(fecha + 'T00:00:00Z'); // Asegúrate de que se compare al comienzo del día en UTC.

    // Obtenemos la fecha actual y la ajustamos a medianoche en UTC para la comparación.
    const fechaActual = new Date();
    fechaActual.setUTCHours(0, 0, 0, 0);

    // Verificamos si la fecha ingresada es anterior o igual a la fecha actual.
    if (fechaIngresada <= fechaActual) {
        const mensaje = fechaIngresada < fechaActual ? 
            'No se pueden agendar bloques médicos en una fecha pasada.' : 
            'No se pueden agendar bloques médicos para el mismo día.';
        return res.status(400).json({
            ok: false,
            msg: mensaje
        });
    }


    const [anio, mes, dia] = fecha.split('-');
    const fechaUTC = new Date(Date.UTC(Number(anio), Number(mes) - 1, Number(dia)));
    const diaSemana = numberToDay(fechaUTC.getUTCDay());
    let bloquesTotales: any[] = [];

    try {
        let tipoCitaEncontrado: TipoCita | null;

        if (especialidad === 'Consulta general') {
            tipoCitaEncontrado = await TipoCita.findOne({ where: { tipo_cita: especialidad } });
        } else {
            tipoCitaEncontrado = await buscarTipoCita(especialidad);
        }

        if (!tipoCitaEncontrado) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontró el tipo de cita'
            });
        }
        const idTipoCita = tipoCitaEncontrado.idTipo
  
        const horarios_medico = await buscarHorarioMedico(tipoCitaEncontrado, diaSemana);
        console.log('Aqui estan los horarios del medico',horarios_medico);
        for (let horario of horarios_medico) {
            const bloquesDisponibles = await buscarBloquesDisponibles(horario, tipoCitaEncontrado.duracion_cita, fecha, tipoCitaEncontrado.precio, idTipoCita, horario.especialidad_medica);
            bloquesTotales = [...bloquesTotales, ...bloquesDisponibles];
        }

        res.json({
            ok: true,
            bloques: bloquesTotales
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs',
        });
    }
}


export async function buscarTipoCita(especialidad_medica: any) {
    console.log('aqui',especialidad_medica);
 
    const tipoCita = await TipoCita.findOne({ where: { especialidad_medica } });
    console.log('aqui el tipo cita encontrado',tipoCita);
       /*
         dataValues: {
    idTipo: 3,
    tipo_cita: 'Consulta Especialidad',
    precio: 5678,
    especialidad_medica: 'Dermatologia',
    color_etiqueta: '#3498db',
    duracion_cita: 20,
    createdAt: 2023-10-21T02:23:38.000Z,
    updatedAt: 2023-10-22T14:04:39.000Z
  },
    */
    if (!tipoCita) {
        throw new Error('Tipo de cita no encontrado');
    }
    return tipoCita;
}

interface WhereClause {
    diaSemana: string;
    rut_medico?: string;
}

export async function buscarHorarioMedico(tipoCita: any, diaSemana: string) {
    

    let whereClause: WhereClause = { diaSemana: diaSemana };

    if (tipoCita.tipo_cita === 'Consulta Especialidad') {
        const medicosConEspecialidad = await Medico.findAll({
            where: {
                especialidad_medica: tipoCita.especialidad_medica,
                estado: 'activo'  // Filtrar solo los médicos activos
            }
        });
        
        if (medicosConEspecialidad.length === 0) {
            return [];
        }
        
        const horariosDeTodosLosMedicos = [];
        
        for (const medico of medicosConEspecialidad) {
            const horariosMedico = await HorarioMedic.findAll({
                where: {
                    diaSemana: diaSemana,
                    rut_medico: medico.rut
                },
                attributes: ['rut_medico', 'horaInicio', 'horaFinalizacion'],
                include: [
                    {
                        model: Medico,
                        as: 'medico',
                        attributes: ['rut', 'nombre', 'apellidos', 'especialidad_medica'],
                        where: {
                            estado: 'activo'  // Incluir solo médicos activos
                        }
                    },
                ],
            });
            horariosDeTodosLosMedicos.push(...horariosMedico);
        }
        
        return horariosDeTodosLosMedicos.map((row: any) => ({
            dia: diaSemana,
            rut: row.rut_medico,
            horainicio: row.horaInicio,
            horafinalizacion: row.horaFinalizacion,
            especialidad_medica: tipoCita.tipo_cita === 'Consulta general' ? row.medico.especialidad_medica : row.medico.especialidad_medica
        }));
    }
    return [];
}



export async function buscarBloquesDisponibles(resultadoFormateado: any, duracionCita: number, fechaFormateada: string, precioCita: number, idTipoCita: number, especialidad: string) {
    if (!resultadoFormateado || !resultadoFormateado.horainicio || !resultadoFormateado.horafinalizacion) {
        throw new Error('Datos del horario del médico no proporcionados correctamente.');
    }

    const medicoRut = resultadoFormateado.rut;
    
    // Obtener el nombre del médico utilizando el medicoRut
    const medicoData = await Medico.findOne({ where: { rut: medicoRut } });
    if (!medicoData) throw new Error('Médico no encontrado');
    const medicoNombre = `${medicoData.nombre} ${medicoData.apellidos}`;

    const horarioInicio = timeToMinutes(resultadoFormateado.horainicio);
    const horarioFin = timeToMinutes(resultadoFormateado.horafinalizacion);
    const intervalo = duracionCita;

    const bloquesPosibles = [];
    for (let i = horarioInicio; i + intervalo <= horarioFin; i += intervalo) {
        bloquesPosibles.push({
            rutMedico: medicoRut,
            medicoNombre,  // Agregar el nombre del médico a cada bloque
            hora_inicio: minutesToTime(i),
            hora_fin: minutesToTime(i + intervalo),
            precio: precioCita,
            idTipoCita,
            especialidad,
            fecha: fechaFormateada
        });
    }

    const citasProgramadas = await CitaMedica.findAll({
        where: {
            rut_medico: medicoRut,
            fecha: {
                [Op.eq]: new Date(fechaFormateada)
            }
            
        }
    });
    

   

    const bloquesOcupados = citasProgramadas.map(cita => ({
        hora_inicio: cita.hora_inicio,
        hora_fin: cita.hora_fin
    }));

    return bloquesPosibles.filter(bloquePosible =>
        !bloquesOcupados.some(bloqueOcupado =>
            bloquePosible.hora_inicio < bloqueOcupado.hora_fin && bloquePosible.hora_fin > bloqueOcupado.hora_inicio
        )
    );
}



