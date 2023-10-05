import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';

class Medico extends Model {
  public id!: string;
  public nombre!: string;
  public apellidos!: string;
  public email!: string;
  public direccion!: string;
  public foto!: string;
  public estudios!: string;
  public redes_sociales!: string;
  public nacionalidad!: string;
  public titulos!: string;
}

Medico.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    foto: {
      type: DataTypes.STRING,
    },
    estudios: {
      type: DataTypes.STRING,
    },
    redes_sociales: {
      type: DataTypes.STRING,
    },
    nacionalidad: {
      type: DataTypes.STRING,
    },
    titulos: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    modelName: 'Medico',
    timestamps: true,
  }
);

export default Medico;
