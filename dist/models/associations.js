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
const factura_1 = __importDefault(require("./factura"));
usuario_1.default.hasMany(cita_medica_1.default, { foreignKey: 'rut_paciente', sourceKey: 'rut' });
usuario_1.default.hasMany(historial_medico_1.default, { foreignKey: 'rut_paciente', sourceKey: 'rut' });
// Asociaciones de TipoCita
tipo_cita_1.default.hasOne(cita_medica_1.default, { foreignKey: 'idTipoCita', sourceKey: 'idTipo' });
// Asociaciones de CitaMedica
cita_medica_1.default.belongsTo(usuario_1.default, { foreignKey: 'rut_paciente', targetKey: 'rut', as: 'paciente' });
cita_medica_1.default.belongsTo(medico_1.default, { foreignKey: 'rut_medico', targetKey: 'rut', as: 'medico' });
cita_medica_1.default.belongsTo(tipo_cita_1.default, { foreignKey: 'idTipoCita', targetKey: 'idTipo', as: 'tipoCita' });
/* ESTE CODIGO ESTABA ANTES
CitaMedica.hasOne(Factura, { foreignKey: 'id_cita', sourceKey: 'idCita' });
*/
// En tus asociaciones
cita_medica_1.default.hasOne(factura_1.default, { foreignKey: 'id_cita', sourceKey: 'idCita', as: 'factura' });
// Asociaciones de Medico
medico_1.default.hasMany(cita_medica_1.default, { foreignKey: 'rut_medico', sourceKey: 'rut' });
medico_1.default.hasMany(horario_medico_1.default, { foreignKey: 'rut_medico', sourceKey: 'rut' });
horario_medico_1.default.belongsTo(medico_1.default, { foreignKey: 'rut_medico', targetKey: 'rut', as: 'medico' });
// Asociación de HistorialMedico con Usuario (paciente)
historial_medico_1.default.belongsTo(usuario_1.default, { foreignKey: 'rut_paciente', targetKey: 'rut', as: 'paciente' });
// Asociación de Factura con CitaMedica
// Asegúrate de que la clave foránea sea la correcta
factura_1.default.belongsTo(cita_medica_1.default, { foreignKey: 'id_cita', targetKey: 'idCita', as: 'citaMedica' });
//# sourceMappingURL=associations.js.map