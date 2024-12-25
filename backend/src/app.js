import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './config/db.js';
import routes from './routes/router.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());
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