import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Clean Academy API',
    description: 'API para gerenciamento de cursos e usuários',
    version: '1.0.0',
  },
  host: 'localhost:5000', // Altere para o domínio de produção, se necessário
  schemes: ['http'], // Use 'https' em produção
};

const outputFile = './swagger-output.json'; // Arquivo gerado
const endpointsFiles = ['./routes/router.js']; // Arquivos de rotas

swaggerAutogen()(outputFile, endpointsFiles, doc);