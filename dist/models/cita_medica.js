"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const tipo_cita_1 = __importDefault(require("./tipo_cita"));
class CitaMedica extends sequelize_1.Model {
}
CitaMedica.init({
    idCita: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    motivo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    rut_paciente: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Usuario',
            key: 'rut',
        },
    },
    rut_medico: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'Medico',
            key: 'id',
        },
    },
    fecha: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    hora_inicio: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    hora_fin: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    estado: {
        type: sequelize_1.DataTypes.ENUM('en_curso', 'terminado', 'no_asistio'),
        allowNull: false,
        defaultValue: 'en_curso' // Valor por defecto cuando se crea una cita
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    idTipoCita: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: tipo_cita_1.default,
            key: 'idTipo',
        }
    },
}, {
    sequelize: connection_1.default,
    modelName: 'CitaMedica',
});
exports.default = CitaMedica;
//# sourceMappingURL=cita_medica.js.map