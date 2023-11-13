import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';
// Define el modelo de HorarioLaboral
class HorarioMedic extends Model {
  idHorario!: number; // El signo de interrogación indica que es opcional, ya que se autoincrementa en la base de datos
  diaSemana!: string;
  horaInicio!: string;
  horaFinalizacion!: string;

  rut_medico!: string;
  disponibilidad!: boolean;
  fechaCreacion!: Date;
  }

// Define el modelo para el paciente
// Inicializa el modelo
HorarioMedic.init(
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


    rut_medico: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disponibilidad: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

  },
  {
    sequelize: db, // Conecta el modelo a tu instancia de Sequelize
    modelName: 'HorarioMedic', // Nombre de la tabla en la base de datos
    tableName: 'horarioMedicos'
  }
);
  
  export default HorarioMedic;