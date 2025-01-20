import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './config/db.js';
import routes from './routes/router.js';
import { fileURLToPath } from "url";


const app = express();

app.use(cors());
app.use(bodyParser.json());     
app.use(express.urlencoded({ extended: true }));

import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/api/product', express.static(path.join(__dirname, 'public/product')));

app.use('/api', routes);


app.get('/api/hello', (req, res) => {
    res.send('Hello, World!');
})


db.sync().then(()=>{
    console.log('Conectado ao banco de dados');
}).catch(err => {console
    .log('Erro ao conectar ao banco de dados', err);
});

export default app;