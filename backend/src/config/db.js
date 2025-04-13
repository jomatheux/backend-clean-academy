import { Sequelize } from 'sequelize';
import dotenv from 'dotenv/config';

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  dialect: process.env.DB_DIALECT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
    retry: {
      max: 5 // Tentar reconectar até 5 vezes
    }
  },
});

try {
    await db.authenticate();
    console.log('Conexão com o banco de dados realizada com sucesso!');
} catch (error) {
    console.log(`Não foi possível conectar: ${error}`);
}

export default db;