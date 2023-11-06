"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// associations.ts
const usuario_1 = __importDefault(require("./usuario"));
const tipo_cita_1 = __importDefault(require("./tipo_cita"));
const cita_medica_1 = __importDefault(require("./cita_medica"));
const medico_1 = __importDefault(require("./medico"));
const horario_medico_1 = __importDefault(require("./horario_medico"));
const historial_medico_1 = __importDefault(require("./historial_medico"));
// Asociaciones de Usuario
usuario_1.default.hasMany(cita_medica_1.default, { foreignKey: 'rut_paciente', sourceKey: 'rut' });
//Usuario.hasOne(CitaMedica, { foreignKey: 'rut_paciente', sourceKey: 'rut'  });
usuario_1.default.hasMany(historial_medico_1.default, { foreignKey: 'rut_paciente', sourceKey: 'rut' });
// Asociaciones de TipoCita
tipo_cita_1.default.hasOne(cita_medica_1.default, { foreignKey: 'idTipoCita', sourceKey: 'idTipo' });
// Asociaciones de Medico
medico_1.default.hasMany(cita_medica_1.default, { foreignKey: 'rut_medico', sourceKey: 'rut' });
medico_1.default.hasMany(horario_medico_1.default, { foreignKey: 'rut_medico', sourceKey: 'rut' });
// Asociación de CitaMedica con Usuario (paciente)
cita_medica_1.default.belongsTo(usuario_1.default, { foreignKey: 'rut_paciente', targetKey: 'rut', as: 'paciente' });
//CitaMedica.belongsTo(Usuario, { foreignKey: 'rut_paciente', targetKey: 'rut', as: 'paciente' });
// Asociación de HistorialMedico con Usuario (paciente)
historial_medico_1.default.belongsTo(usuario_1.default, { foreignKey: 'rut_paciente', targetKey: 'rut', as: 'paciente' });
// Asociación de CitaMedica con TipoCita
cita_medica_1.default.belongsTo(tipo_cita_1.default, { foreignKey: 'idTipoCita', targetKey: 'idTipo', as: 'tipoCita' });
// Asociación de CitaMedica con Medico
cita_medica_1.default.belongsTo(medico_1.default, { foreignKey: 'rut_medico', targetKey: 'rut', as: 'medico' });
horario_medico_1.default.belongsTo(medico_1.default, { foreignKey: 'rut_medico', targetKey: 'rut', as: 'medico' });
//# sourceMappingURL=associations.js.map