"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class Factura extends sequelize_1.Model {
}
Factura.init({
    id_factura: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_cita: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'CitaMedica',
            key: 'id_cita', // Clave en CitaMedica que es referenciada
        },
    },
    detalles_pago: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    monto_pagado: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    estado_pago: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pendiente',
    },
    // ... otros campos
}, {
    sequelize: connection_1.default,
    modelName: 'Factura',
});
//# sourceMappingURL=factura.js.map