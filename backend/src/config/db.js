import { Sequelize } from 'sequelize';
import dotenv from 'dotenv/config';

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  dialect: process.env.DB_DIALECT,
});

try {
    db.authenticate();
    console.log('Conexão com o banco de dados realizada com sucesso!');
} catch (error) {
    console.log(`Não foi possível conectar: ${error}`);
}

export default db;