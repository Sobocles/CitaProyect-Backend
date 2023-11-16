"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class HorarioMedic extends sequelize_1.Model {
}
// ... definición de las propiedades y métodos
// Define el modelo para el paciente
// Inicializa el modelo
HorarioMedic.init({
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
    rut_medico: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    disponibilidad: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
    fechaCreacion: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW, // O lo que sea apropiado para tu lógica de negocio
    },
}, {
    sequelize: connection_1.default,
    modelName: 'HorarioMedic',
    tableName: 'horarioMedicos'
});
exports.default = HorarioMedic;
//# sourceMappingURL=horario_medico.js.map