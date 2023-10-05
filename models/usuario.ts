import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';
class Usuario extends Model {
    public rut!: string;
    public nombre!: string;
    public apellidos!: string;
    public email!: string;
    public password!: string;
    public fecha_nacimiento!: string;
    public telefono!: string;
    public direccion!: string;
    // Asegura que TypeScript conozca estas propiedades
  }

// Define el modelo para el paciente
Usuario.init(
    {
      rut: {
        type: DataTypes.STRING, // Puedes definir 'id' como una cadena
        primaryKey: true, // Esto marca 'id' como clave primaria
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
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fecha_nacimiento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      telefono: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize: db, // Conecta el modelo a tu instancia de Sequelize
      modelName: 'Usuario', // Nombre de la tabla en la base de datos
    }
  );
  
  export default Usuario;