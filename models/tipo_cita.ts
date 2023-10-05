// Importa los módulos necesarios de Sequelize
import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';

// Asegúrate de importar tu instancia Sequelize correctamente

// Define el modelo TipoCitaMedica
class TipoCitaMedica extends Model {
  public id_tipo!: number;
  public tipo_cita!: string;
  public cita_medica_id!: number;
  public precio!: number;
  public especialidad_medica!: string;
  public color_etiqueta!: string;

  // Puedes definir relaciones con otras tablas aquí si es necesario
}

// Inicializa el modelo TipoCitaMedica con los atributos y opciones de Sequelize
TipoCitaMedica.init(
  {
    idTipo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tipo_cita: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    citaMedicaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'CitaMedica', // Nombre de la tabla referenciada
        key: 'id_cita', // Nombre de la clave primaria en la tabla referenciada
      },
    },
    precio: {
      type: DataTypes.FLOAT, // O ajusta el tipo de dato según corresponda
      allowNull: false,
    },
    especialidad_medica: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color_etiqueta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'tipo_cita',
    timestamps: true,
  }
);

// Exporta el modelo para que pueda ser utilizado en otras partes de tu aplicación
export default TipoCitaMedica;
