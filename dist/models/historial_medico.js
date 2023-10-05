"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importa las dependencias necesarias
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection")); // Asegúrate de importar tu conexión a la base de datos
const usuario_1 = __importDefault(require("../models/usuario")); // Importa el modelo de paciente
class HistorialMedico extends sequelize_1.Model {
}
// Define el modelo para el historial médico
HistorialMedico.init({
    id_historial: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    diagnostico: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    medicamento: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    notas: {
        type: sequelize_1.DataTypes.STRING,
    },
    fecha_consulta: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    archivo: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: connection_1.default,
    modelName: 'HistorialMedico', // Nombre de la tabla en la base de datos
});
exports.default = HistorialMedico;
// Define la relación con el modelo de paciente
HistorialMedico.belongsTo(usuario_1.default, {
    foreignKey: 'rut_paciente',
    targetKey: 'rut',
    as: 'paciente', // Alias para la relación (puedes usar otro nombre si lo prefieres)
});
//# sourceMappingURL=historial_medico.js.map