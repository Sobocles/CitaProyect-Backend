"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factura = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
// Extiende Model con FacturaAttributes
class Factura extends sequelize_1.Model {
}
exports.Factura = Factura;
// Inicialización del modelo Factura
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
            key: 'id_cita',
        },
    },
    payment_method_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    transaction_amount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    payment_status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    status_detail: {
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
    fecha_pago: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: connection_1.default,
    modelName: 'Factura',
});
exports.default = Factura;
/*
import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';

class Factura extends Model {
    public id_factura!: number; // Clave primaria única para cada factura
    public id_cita!: number; // Clave extranjera que apunta a CitaMedica
    public payment_method_id!: string; // Método de pago
    public transaction_amount!: number; // Monto de la transacción
    public payment_status!: string; // Estado del pago
    public status_detail!: string; // Detalle del estado del pago
    public monto_pagado!: number; // Monto pagado en la factura
    public estado_pago!: string; // Estado general del pago: 'pendiente', 'completado', etc.
    // ... otros campos relevantes para la factura
}

Factura.init({
    id_factura: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_cita: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'CitaMedica',
            key: 'id_cita',
        },
    },
    payment_method_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    transaction_amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    payment_status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status_detail: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    monto_pagado: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    estado_pago: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pendiente',
    },
    // ... otros campos
}, {
    sequelize: db,
    modelName: 'Factura',
});

export default Factura;



*/ 
//# sourceMappingURL=factura.js.map