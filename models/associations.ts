// associations.ts
import Usuario from './usuario';
import TipoCita from './tipo_cita';
import CitaMedica from './cita_medica';
import Medico from './medico';
import HorarioMedic from './horario_medico';
import HistorialMedico from './historial_medico';
import Factura from './factura';

Usuario.hasMany(CitaMedica, { foreignKey: 'rut_paciente', sourceKey: 'rut' });
Usuario.hasMany(HistorialMedico, { foreignKey: 'rut_paciente', sourceKey: 'rut' });

// Asociaciones de TipoCita
TipoCita.hasOne(CitaMedica, { foreignKey: 'idTipoCita', sourceKey: 'idTipo' });

// Asociaciones de CitaMedica
CitaMedica.belongsTo(Usuario, { foreignKey: 'rut_paciente', targetKey: 'rut', as: 'paciente' });
CitaMedica.belongsTo(Medico, { foreignKey: 'rut_medico', targetKey: 'rut', as: 'medico' });
CitaMedica.belongsTo(TipoCita, { foreignKey: 'idTipoCita', targetKey: 'idTipo', as: 'tipoCita' });
/* ESTE CODIGO ESTABA ANTES
CitaMedica.hasOne(Factura, { foreignKey: 'id_cita', sourceKey: 'idCita' });
*/

// En tus asociaciones
CitaMedica.hasOne(Factura, { foreignKey: 'id_cita', sourceKey: 'idCita', as: 'factura' });


// Asociaciones de Medico
Medico.hasMany(CitaMedica, { foreignKey: 'rut_medico', sourceKey: 'rut' });
Medico.hasMany(HorarioMedic, { foreignKey: 'rut_medico', sourceKey: 'rut' });
HorarioMedic.belongsTo(Medico, { foreignKey: 'rut_medico', targetKey: 'rut', as: 'medico' });

// Asociación de HistorialMedico con Usuario (paciente)
HistorialMedico.belongsTo(Usuario, { foreignKey: 'rut_paciente', targetKey: 'rut', as: 'paciente' });

// Asociación de Factura con CitaMedica
// Asegúrate de que la clave foránea sea la correcta
Factura.belongsTo(CitaMedica, { foreignKey: 'id_cita', targetKey: 'idCita', as: 'citaMedica' });
