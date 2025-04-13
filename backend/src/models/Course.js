import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // Certifique-se de ajustar o caminho para o arquivo de configuração do banco

const Course = sequelize.define('Course', {
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
    duration: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    level:{
        type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
        allowNull: false,
    },
    instructor:{
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true, // Gera automaticamente os campos 'createdAt' e 'updatedAt'
    tableName: 'tb_courses', // Nome da tabela no banco
});

export default Course;