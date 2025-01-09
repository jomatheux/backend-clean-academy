import { DataTypes } from 'sequelize';
import sequelize from'../config/db.js'; // Certifique-se de ajustar o caminho para o arquivo de configuração do banco

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cpf: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Valida se é um e-mail
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'), // Diferencia entre administrador e funcionário
    allowNull: false,
    defaultValue: 'user',
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true, // Imagem é opcional
  },
  // phone: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
}, {
  timestamps: true, // Gera automaticamente os campos 'createdAt' e 'updatedAt'
  tableName: 'tb_users', // Nome da tabela no banco
});


export default User;