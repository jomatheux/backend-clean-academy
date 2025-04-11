import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Clean Academy API',
    description: 'API para gerenciamento de cursos e usuários',
    version: '1.0.0',
  },
  host: 'localhost:5000', // Altere para o domínio de produção, se necessário
  schemes: ['http'], // Use 'https' em produção
  tags: [
    {
      name: 'Users',
      description: 'Rotas relacionadas a usuários',
    },
    {
      name: 'Courses',
      description: 'Rotas relacionadas aos cursos',
    },
    {
      name: 'Tests',
      description: 'Rotas relacionadas aos testes',
    },
    {
      name: 'Products',
      description: 'Rotas relacionadas aos produtos',
    },
    {
      name: 'Reports',
      description: 'Rotas relacionadas aos relatórios',
    },
  ],
};

const outputFile = './swagger-output.json'; // Arquivo gerado
const endpointsFiles = ['./routes/router.js']; // Arquivos de rotas

swaggerAutogen()(outputFile, endpointsFiles, doc);