import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false, // URL do vídeo (pode ser local ou hospedado em algum serviço)
    validate: {
      isUrl: true, // Valida se é uma URL válida
    },
  },
  duration: {
    type: DataTypes.INTEGER, // Duração em segundos
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'tb_videos',
});

export default Video;