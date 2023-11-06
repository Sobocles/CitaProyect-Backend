import { Model, DataTypes } from 'sequelize';
import db from '../db/connection';
import TipoCita from './tipo_cita';

class CitaMedica extends Model {
  public id_cita!: number;
  public motivo!: string;
  public rut_paciente!: string;
  public rut_medico!: string;
  public fecha!: Date;
  public hora_inicio!: string;
  public hora_fin!: string;
  public estado!: string;  // Este campo ya existe
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
        model: 'Usuario',
        key: 'rut',
      },
    },
    rut_medico: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Medico',
        key: 'id',
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
      type: DataTypes.ENUM('en_curso', 'terminado', 'no_asistio'),  // Definido como ENUM
      allowNull: false,
      defaultValue: 'en_curso'  // Valor por defecto cuando se crea una cita
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idTipoCita: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: TipoCita,
        key: 'idTipo',
      }
    },
  },
  {
    sequelize: db,
    modelName: 'CitaMedica',
  }
);

export default CitaMedica;
