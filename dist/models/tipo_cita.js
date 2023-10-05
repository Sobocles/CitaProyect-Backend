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
class TipoCitaMedica extends sequelize_1.Model {
}
// Inicializa el modelo TipoCitaMedica con los atributos y opciones de Sequelize
TipoCitaMedica.init({
    idTipo: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    tipo_cita: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    citaMedicaId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'CitaMedica',
            key: 'id_cita', // Nombre de la clave primaria en la tabla referenciada
        },
    },
    precio: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    especialidad_medica: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    color_etiqueta: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: connection_1.default,
    modelName: 'tipo_cita',
    timestamps: true,
});
// Exporta el modelo para que pueda ser utilizado en otras partes de tu aplicación
exports.default = TipoCitaMedica;
//# sourceMappingURL=tipo_cita.js.map