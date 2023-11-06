// associations.ts
import Usuario from './usuario';
import TipoCita from './tipo_cita';
import CitaMedica from './cita_medica';
import Medico from './medico';
import HorarioMedic from './horario_medico';
import HistorialMedico from './historial_medico';

// Asociaciones de Usuario
Usuario.hasMany(CitaMedica, { foreignKey: 'rut_paciente', sourceKey: 'rut' });
//Usuario.hasOne(CitaMedica, { foreignKey: 'rut_paciente', sourceKey: 'rut'  });
Usuario.hasMany(HistorialMedico, { foreignKey: 'rut_paciente', sourceKey: 'rut' });

// Asociaciones de TipoCita
TipoCita.hasOne(CitaMedica, { foreignKey: 'idTipoCita', sourceKey: 'idTipo' });


// Asociaciones de Medico
Medico.hasMany(CitaMedica, { foreignKey: 'rut_medico', sourceKey: 'rut' });
Medico.hasMany(HorarioMedic, { foreignKey: 'rut_medico', sourceKey: 'rut' });

// Asociación de CitaMedica con Usuario (paciente)
CitaMedica.belongsTo(Usuario, { foreignKey: 'rut_paciente', targetKey: 'rut', as: 'paciente' });
//CitaMedica.belongsTo(Usuario, { foreignKey: 'rut_paciente', targetKey: 'rut', as: 'paciente' });

// Asociación de HistorialMedico con Usuario (paciente)
HistorialMedico.belongsTo(Usuario, { foreignKey: 'rut_paciente', targetKey: 'rut', as: 'paciente' });

// Asociación de CitaMedica con TipoCita
CitaMedica.belongsTo(TipoCita, { foreignKey: 'idTipoCita', targetKey: 'idTipo', as: 'tipoCita' });


// Asociación de CitaMedica con Medico
CitaMedica.belongsTo(Medico, { foreignKey: 'rut_medico', targetKey: 'rut', as: 'medico' });
HorarioMedic.belongsTo(Medico, { foreignKey: 'rut_medico', targetKey: 'rut', as: 'medico' });
