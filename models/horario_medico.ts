import { DataTypes, Model } from 'sequelize';
import db from '../db/connection';
import Medico from './medico';


interface HorarioMedicAttributes {
  idHorario?: number;
  diaSemana: string;
  horaInicio: string;
  horaFinalizacion: string;
  rut_medico: string;
  disponibilidad?: boolean;
  fechaCreacion?: Date;
}

class HorarioMedic extends Model<HorarioMedicAttributes> implements HorarioMedicAttributes {
  public idHorario!: number;
  public diaSemana!: string;
  public horaInicio!: string;
  public horaFinalizacion!: string;
  public rut_medico!: string;
  public disponibilidad?: boolean;
  public fechaCreacion?: Date;

  // Aquí puedes agregar métodos o propiedades adicionales si lo necesitas
}

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
    fechaCreacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: db,
    modelName: 'HorarioMedic',
    tableName: 'horarioMedicos'
  }
);

export default HorarioMedic;

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