"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
// Define el modelo de HorarioLaboral
class HorarioMedico extends sequelize_1.Model {
}
// Define el modelo para el paciente
// Inicializa el modelo
HorarioMedico.init({
    idHorario: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    diaSemana: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    horaInicio: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
    horaFinalizacion: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
    duracionCitas: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    rutMedico: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    disponibilidad: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
    },
    fechaCreacion: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: connection_1.default,
    modelName: 'HorarioMedico', // Nombre de la tabla en la base de datos
});
exports.default = HorarioMedico;
//# sourceMappingURL=horario_medico.js.map