import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Certifique-se de ajustar o caminho para o arquivo de configuração do banco


const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  grade: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  attempt: {
    type: DataTypes.INTEGER, // Número da tentativa
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
  tableName: 'tb_reports',
});

export default Report;