import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Course from './Course.js';

const Test = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  questions: {
    type: DataTypes.JSON, // Lista de questões e respostas
    allowNull: false,
  },
  qntQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  minGrade: {
    type: DataTypes.FLOAT, // Nota mínima para aprovação
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'tb_tests',
});


export default Test;
