"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
class HorarioMedic extends sequelize_1.Model {
}
HorarioMedic.init({
    idHorario: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    diaSemana: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    horaInicio: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
    horaFinalizacion: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: false,
    },
    rut_medico: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    disponibilidad: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
    fechaCreacion: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: connection_1.default,
    modelName: 'HorarioMedic',
    tableName: 'horarioMedicos'
});
exports.default = HorarioMedic;
/*
// Extendemos los atributos para incluir las relaciones
interface HorarioMedicAttributes {
  idHorario?: number;
  diaSemana: string;
  horaInicio: string;
  horaFinalizacion: string;
  rut_medico: string;
  disponibilidad?: boolean;
  fechaCreacion?: Date; // Hacerlo opcional si es manejado automáticamente
  // ...
}


class HorarioMedic extends Model<HorarioMedicAttributes> {
  // ... propiedades y métodos del modelo
  
  // Agregamos la propiedad de asociación
  public readonly medico?: Medico;
}

  // ... definición de las propiedades y métodos


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
    fechaCreacion: { // Asegúrate de agregar esta línea
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // O lo que sea apropiado para tu lógica de negocio
    },
  },
  {
    sequelize: db,
    modelName: 'HorarioMedic',
    tableName: 'horarioMedicos'
  }
);

  
  export default HorarioMedic; */ 
//# sourceMappingURL=horario_medico.js.map