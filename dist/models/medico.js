"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class Medico extends sequelize_1.Model {
}
Medico.init({
    rut: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    apellidos: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    telefono: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    direccion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    foto: {
        type: sequelize_1.DataTypes.STRING,
    },
    nacionalidad: {
        type: sequelize_1.DataTypes.STRING,
    },
    especialidad_medica: {
        type: sequelize_1.DataTypes.STRING,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    rol: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'MEDICO_ROLE', // Esto garantiza que, por defecto, el rol sea 'MEDICO'
    }
}, {
    sequelize: connection_1.default,
    modelName: 'Medico',
    tableName: 'medicos' // Nombre real de la tabla en la base de datos
});
// Definir la relación con CitaMedica
exports.default = Medico;
//# sourceMappingURL=medico.js.map