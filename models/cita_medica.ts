import { Model, DataTypes } from 'sequelize';

import db from '../db/connection';

class CitaMedica extends Model {
  public id_cita!: number;
  public motivo!: string;
  public rut_paciente!: string;
  public rut_medico!: string;
  public fecha!: Date;
  public hora_inicio!: string;
  public hora_fin!: string;
  public estado!: string;
  public descripcion!: string;

}

CitaMedica.init(
  {
    idCita: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rut_paciente: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'rut',
      },
    },
    rut_medico: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'medico',
        key: 'rut',
      },
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    hora_inicio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hora_fin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db, // Conecta el modelo a tu instancia de Sequelize
    modelName: 'citamedica', // Nombre de la tabla en la base de datos
  }
);


export default CitaMedica;

