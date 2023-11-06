// Importa los módulos necesarios de Sequelize
import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';
import CitaMedica from './cita_medica';
// Asegúrate de importar tu instancia Sequelize correctamente

// Define el modelo TipoCitaMedica
class TipoCita extends Model {
  public idTipo!: number;
  public tipo_cita!: string;
  public precio!: number;
  public especialidad_medica!: string;
  public color_etiqueta!: string;
  public duracion_cita!: number;

  // Puedes definir relaciones con otras tablas aquí si es necesario
}


// Inicializa el modelo TipoCitaMedica con los atributos y opciones de Sequelize
TipoCita.init(
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
    precio: {
      type: DataTypes.FLOAT, // O ajusta el tipo de dato según corresponda
      allowNull: false,
    },
    especialidad_medica: {
      type: DataTypes.STRING,

    },
    color_etiqueta: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    duracion_cita: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
  },
  {
    sequelize: db, // Conecta el modelo a tu instancia de Sequelize
    modelName: 'TipoCita', // Nombre de la tabla en la base de datos
    tableName: 'tipo_cita' // Nombre real de la tabla en la base de datos
}
);



// Exporta el modelo para que pueda ser utilizado en otras partes de tu aplicación
export default TipoCita;
