import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import db from './config/db.js';
import routes from './routes/router.js';
import { fileURLToPath } from "url";
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
const swaggerDocument = JSON.parse(readFileSync('./src/swagger-output.json', 'utf-8')); // Carrega o JSON manualmente

const app = express();

const corsOptions = {
    origin: ['http://localhost:3001', 'https://new-clean-academy.vercel.app'], // Permite apenas esta origem
    credentials: true, // Permite cookies e cabeçalhos de autorização
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Configurando config de upload
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/api/product', express.static(path.join(__dirname, 'public/product')));
app.use('/api/course', express.static(path.join(__dirname, 'public/course')));
app.use('/api/video', express.static(path.join(__dirname, 'public/video')));
app.use('/api/user', express.static(path.join(__dirname, 'public/user')));


// Configurando rotas
app.use('/api', routes);

// Configurando Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

db.sync().then(() => {
    console.log('Conectado ao banco de dados');
}).catch(err => {
    console
        .log('Erro ao conectar ao banco de dados', err);
});

export default app;