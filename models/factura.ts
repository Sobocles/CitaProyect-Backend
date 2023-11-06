
import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';


class Factura extends Model {
    public id_factura!: number; // Clave primaria única para cada factura
    public id_cita!: number; // Clave extranjera que apunta a CitaMedica
    public detalles_pago!: string; // Detalles sobre el pago realizado
    public monto_pagado!: number; // Monto pagado en la factura
    public estado_pago!: string; // Estado del pago: 'pendiente', 'completado', etc.
    // ... otros campos relevantes para la factura
  }
  
  Factura.init(
    {
      id_factura: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      id_cita: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'CitaMedica', // Nombre del modelo al que hace referencia
          key: 'id_cita',      // Clave en CitaMedica que es referenciada
        },
      },
      detalles_pago: {
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
    },
    {
      sequelize: db,
      modelName: 'Factura',
    }
  );
  