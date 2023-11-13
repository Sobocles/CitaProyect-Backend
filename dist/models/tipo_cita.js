"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importa los módulos necesarios de Sequelize
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
// Asegúrate de importar tu instancia Sequelize correctamente
// Define el modelo TipoCitaMedica
class TipoCita extends sequelize_1.Model {
}
// Inicializa el modelo TipoCitaMedica con los atributos y opciones de Sequelize
TipoCita.init({
    idTipo: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tipo_cita: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    precio: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    especialidad_medica: {
        type: sequelize_1.DataTypes.STRING,
    },
    duracion_cita: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true,
    },
}, {
    sequelize: connection_1.default,
    modelName: 'TipoCita',
    tableName: 'tipo_cita' // Nombre real de la tabla en la base de datos
});
// Exporta el modelo para que pueda ser utilizado en otras partes de tu aplicación
exports.default = TipoCita;
//# sourceMappingURL=tipo_cita.js.map