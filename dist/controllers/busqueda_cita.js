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
exports.buscarBloquesDisponibles = exports.buscarHorarioMedico = exports.buscarTipoCita = exports.buscarmedico = void 0;
const sequelize_1 = require("sequelize");
const medico_1 = __importDefault(require("../models/medico"));
const horario_medico_1 = __importDefault(require("../models/horario_medico"));
const tipo_cita_1 = __importDefault(require("../models/tipo_cita"));
const cita_medica_1 = __importDefault(require("../models/cita_medica"));
// Funciones Auxiliares:
function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}
function minutesToTime(minutes) {
    const hh = Math.floor(minutes / 60).toString().padStart(2, '0');
    const mm = (minutes % 60).toString().padStart(2, '0');
    return `${hh}:${mm}`;
}
function numberToDay(dayNumber) {
    const days = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    return days[dayNumber];
}
// Controlador principal:
// Controlador principal:
const buscarmedico = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    let bloquesTotales = [];
    try {
        let tipoCitaEncontrado;
        if (especialidad === 'Consulta general') {
            tipoCitaEncontrado = yield tipo_cita_1.default.findOne({ where: { tipo_cita: especialidad } });
        }
        else {
            tipoCitaEncontrado = yield buscarTipoCita(especialidad);
        }
        if (!tipoCitaEncontrado) {
            return res.status(400).json({
                ok: false,
                msg: 'No se encontró el tipo de cita'
            });
        }
        const idTipoCita = tipoCitaEncontrado.idTipo;
        const horarios_medico = yield buscarHorarioMedico(tipoCitaEncontrado, diaSemana);
        console.log('Aqui estan los horarios del medico', horarios_medico);
        for (let horario of horarios_medico) {
            const bloquesDisponibles = yield buscarBloquesDisponibles(horario, tipoCitaEncontrado.duracion_cita, fecha, tipoCitaEncontrado.precio, idTipoCita, horario.especialidad_medica);
            bloquesTotales = [...bloquesTotales, ...bloquesDisponibles];
        }
        res.json({
            ok: true,
            bloques: bloquesTotales
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs',
        });
    }
});
exports.buscarmedico = buscarmedico;
function buscarTipoCita(especialidad_medica) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('aqui', especialidad_medica);
        const tipoCita = yield tipo_cita_1.default.findOne({ where: { especialidad_medica } });
        console.log('aqui el tipo cita encontrado', tipoCita);
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
    });
}
exports.buscarTipoCita = buscarTipoCita;
function buscarHorarioMedico(tipoCita, diaSemana) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('AQUIIIIIIII ESTA LLEGANDO TIPO CITA', tipoCita);
        let whereClause = { diaSemana: diaSemana };
        if (tipoCita.tipo_cita === 'Consulta Especialidad') {
            const medicosConEspecialidad = yield medico_1.default.findAll({
                where: {
                    especialidad_medica: tipoCita.especialidad_medica,
                    estado: 'activo' // Filtrar solo los médicos activos
                }
            });
            if (medicosConEspecialidad.length === 0) {
                return [];
            }
            const horariosDeTodosLosMedicos = [];
            for (const medico of medicosConEspecialidad) {
                const horariosMedico = yield horario_medico_1.default.findAll({
                    where: {
                        diaSemana: diaSemana,
                        rut_medico: medico.rut
                    },
                    attributes: ['rut_medico', 'horaInicio', 'horaFinalizacion'],
                    include: [
                        {
                            model: medico_1.default,
                            as: 'medico',
                            attributes: ['rut', 'nombre', 'apellidos', 'especialidad_medica'],
                            where: {
                                estado: 'activo' // Incluir solo médicos activos
                            }
                        },
                    ],
                });
                horariosDeTodosLosMedicos.push(...horariosMedico);
            }
            return horariosDeTodosLosMedicos.map((row) => ({
                dia: diaSemana,
                rut: row.rut_medico,
                horainicio: row.horaInicio,
                horafinalizacion: row.horaFinalizacion,
                especialidad_medica: tipoCita.tipo_cita === 'Consulta general' ? row.medico.especialidad_medica : row.medico.especialidad_medica
            }));
        }
        return [];
    });
}
exports.buscarHorarioMedico = buscarHorarioMedico;
function buscarBloquesDisponibles(resultadoFormateado, duracionCita, fechaFormateada, precioCita, idTipoCita, especialidad) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!resultadoFormateado || !resultadoFormateado.horainicio || !resultadoFormateado.horafinalizacion) {
            throw new Error('Datos del horario del médico no proporcionados correctamente.');
        }
        const medicoRut = resultadoFormateado.rut;
        // Obtener el nombre del médico utilizando el medicoRut
        const medicoData = yield medico_1.default.findOne({ where: { rut: medicoRut } });
        if (!medicoData)
            throw new Error('Médico no encontrado');
        const medicoNombre = `${medicoData.nombre} ${medicoData.apellidos}`;
        const horarioInicio = timeToMinutes(resultadoFormateado.horainicio);
        const horarioFin = timeToMinutes(resultadoFormateado.horafinalizacion);
        const intervalo = duracionCita;
        const bloquesPosibles = [];
        for (let i = horarioInicio; i + intervalo <= horarioFin; i += intervalo) {
            bloquesPosibles.push({
                rutMedico: medicoRut,
                medicoNombre,
                hora_inicio: minutesToTime(i),
                hora_fin: minutesToTime(i + intervalo),
                precio: precioCita,
                idTipoCita,
                especialidad,
                fecha: fechaFormateada
            });
        }
        const citasProgramadas = yield cita_medica_1.default.findAll({
            where: {
                rut_medico: medicoRut,
                fecha: {
                    [sequelize_1.Op.eq]: new Date(fechaFormateada)
                }
            }
        });
        const bloquesOcupados = citasProgramadas.map(cita => ({
            hora_inicio: cita.hora_inicio,
            hora_fin: cita.hora_fin
        }));
        return bloquesPosibles.filter(bloquePosible => !bloquesOcupados.some(bloqueOcupado => bloquePosible.hora_inicio < bloqueOcupado.hora_fin && bloquePosible.hora_fin > bloqueOcupado.hora_inicio));
    });
}
exports.buscarBloquesDisponibles = buscarBloquesDisponibles;
//# sourceMappingURL=busqueda_cita.js.map