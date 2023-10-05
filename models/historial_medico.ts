// Importa las dependencias necesarias
import { DataTypes, Model } from 'sequelize';
import db from '../db/connection'; // Asegúrate de importar tu conexión a la base de datos
import Paciente from '../models/usuario'; // Importa el modelo de paciente

class HistorialMedico extends Model {

  public id_historial_medico!: string;
  public diagnostico!: string;
  public medicamento!: string;
  public notas!: string;
  public fecha_consulta!: Date;
  public archivo!: string;

  // Define relaciones con otros modelos (si es necesario)
  public rut_paciente!: string; // Clave foranea a la tabla paciente
}

// Define el modelo para el historial médico
HistorialMedico.init(
  {
    id_historial: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    diagnostico: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    medicamento: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notas: {
      type: DataTypes.STRING,
    },
    fecha_consulta: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    archivo: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db, // Conecta el modelo a tu instancia de Sequelize
    modelName: 'HistorialMedico', // Nombre de la tabla en la base de datos
  }
);

export default HistorialMedico;


// Define la relación con el modelo de paciente
HistorialMedico.belongsTo(Paciente, {
  foreignKey: 'rut_paciente', // Clave foranea en el modelo HistorialMedico
  targetKey: 'rut', // Clave primaria en el modelo Paciente
  as: 'paciente', // Alias para la relación (puedes usar otro nombre si lo prefieres)
});