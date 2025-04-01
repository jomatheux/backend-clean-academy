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
  },
  duration: {
    type: DataTypes.INTEGER, // Duração em segundos
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true, // URL da imagem do vídeo (pode ser local ou hospedado em algum serviço)
  },
}, {
  timestamps: true,
  tableName: 'tb_videos',
});

export default Video;