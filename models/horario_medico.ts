import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';
// Define el modelo de HorarioLaboral
class HorarioMedico extends Model {
    public idHorario!: number;
    public diaSemana!: string;
    public horaInicio!: string;
    public horaFinalizacion!: string;
    public duracionCitas!: number;
    public rutMedico!: string;
    public disponibilidad!: boolean;
    public fechaCreacion!: Date;
  }

// Define el modelo para el paciente
// Inicializa el modelo
HorarioMedico.init(
    {
      idHorario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      diaSemana: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      horaInicio: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      horaFinalizacion: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      duracionCitas: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rutMedico: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      disponibilidad: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize: db, // Conecta el modelo a tu instancia de Sequelize
      modelName: 'HorarioMedico', // Nombre de la tabla en la base de datos
    }
  );
  
  export default HorarioMedico;