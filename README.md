# Backend - Plataforma de Treinamento

Este é o repositório do backend para a plataforma de treinamento de funcionários. A API é responsável por gerenciar toda a lógica de negócio, incluindo usuários, cursos, vídeos, produtos, testes e o progresso dos funcionários.

## 🚀 Visão Geral do Projeto

A plataforma de treinamento foi desenvolvida para permitir que empresas ofereçam cursos e capacitações para seus colaboradores de forma digital e centralizada. O sistema permite que administradores cadastrem novos cursos, adicionem vídeos e materiais, criem testes de avaliação e gerenciem os usuários da plataforma. Os funcionários, por sua vez, podem consumir os conteúdos, realizar os testes e acompanhar seu desenvolvimento.

## ✨ Funcionalidades Principais

* **Autenticação e Controle de Acesso:**
    * Sistema de login seguro com `JSON Web Tokens (JWT)`.
    * Hashing de senhas com `bcryptjs`.
    * Controle de acesso baseado em papéis (`admin` e `user`), onde apenas administradores podem gerenciar conteúdos e usuários.

* **Gerenciamento de Usuários (Admin):**
    * CRUD completo de usuários (criação, leitura, atualização e exclusão).
    * Busca de usuários por ID e listagem de todos os usuários.

* **Gerenciamento de Cursos (Admin):**
    * CRUD completo de cursos, com informações como título, descrição, duração, nível e instrutor.
    * Upload de imagem de capa para os cursos, com armazenamento no **MinIO**.

* **Gerenciamento de Vídeos (Admin):**
    * Adição, atualização e remoção de vídeos associados a um curso.
    * Upload dos arquivos de vídeo diretamente para o **MinIO**.

* **Gerenciamento de Produtos (Admin):**
    * CRUD de produtos que podem ser associados aos cursos.

* **Gerenciamento de Testes (Admin):**
    * Criação de testes com questões, nota mínima para aprovação e associação a cursos.
    * O teste só é liberado para o usuário após ele completar 100% do curso correspondente.

* **Acompanhamento de Progresso (Usuário):**
    * Inscrição em cursos.
    * O progresso do usuário em um curso é calculado e atualizado automaticamente conforme ele assiste aos vídeos.
    * Registro de tentativas e notas nos testes.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias e ferramentas:

* **Backend:**
    * [Node.js](https://nodejs.org/): Ambiente de execução para JavaScript.
    * [Express.js](https://expressjs.com/): Framework para a construção da API REST.
    * [Sequelize](https://sequelize.org/): ORM (Object-Relational Mapper) para interagir com o banco de dados MySQL.
* **Banco de Dados:**
    * [MySQL](https://www.mysql.com/): Sistema de gerenciamento de banco de dados relacional.
    * [Prisma](https://www.prisma.io/): Utilizado para executar as *migrations* da estrutura inicial do banco de dados.
* **Armazenamento de Arquivos:**
    * [MinIO](https://min.io/): Servidor de armazenamento de objetos de alto desempenho, compatível com a API do Amazon S3.
* **Autenticação:**
    * [JSON Web Token (JWT)](https://jwt.io/): Para a criação de tokens de sessão seguros.
    * [bcryptjs](https://github.com/dcodeIO/bcrypt.js): Para a criptografia de senhas.
* **Documentação da API:**
    * [Swagger](https://swagger.io/): Para documentar e testar os endpoints da API.
* **Containerização:**
    * [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/): Para criar e gerenciar o ambiente de desenvolvimento, incluindo o container do MinIO.
* **Dependências Adicionais:**
    * `dotenv`: Para gerenciar variáveis de ambiente.
    * `cors`: Para habilitar o Cross-Origin Resource Sharing.
    * `multer` e `multer-s3-v3`: Para lidar com o upload de arquivos.
    * `nodemon`: Para reiniciar o servidor automaticamente durante o desenvolvimento.

## 🗂️ Estrutura do Banco de Dados

O banco de dados é modelado utilizando Sequelize e possui as seguintes tabelas principais:

* `tb_users`: Armazena as informações dos usuários (nome, email, CPF, senha, função).
* `tb_courses`: Contém os dados dos cursos (título, descrição, imagem, etc.).
* `tb_videos`: Guarda as informações dos vídeos (título, URL no MinIO, duração) e a sua associação com os cursos.
* `tb_products`: Armazena os produtos que podem ser vinculados aos cursos.
* `tb_user_courses`: Tabela de associação que registra a inscrição e o progresso de um usuário em um curso.
* `tb_tests`: Contém as definições dos testes, incluindo as questões e a nota mínima.
* `tb_reports`: Registra as tentativas dos usuários nos testes, incluindo a nota obtida e o status (aprovado/reprovado).

As associações (relacionamentos) entre essas tabelas estão definidas em `src/models/associations.js`.

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar o backend em seu ambiente de desenvolvimento.

### Pré-requisitos

* **Node.js** (versão 18 ou superior)
* **Docker** e **Docker Compose**
* Um cliente de banco de dados compatível com **MySQL** (DBeaver, MySQL Workbench, etc.)

### Passos

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU-USUARIO/backend-clean-academy.git](https://github.com/SEU-USUARIO/backend-clean-academy.git)
    cd backend-clean-academy/backend
    ```

2.  **Instale as dependências do projeto:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo chamado `.env` na raiz da pasta `backend` e copie o conteúdo abaixo para dentro dele. Substitua os valores conforme necessário.
    ```env
    # Configurações do Banco de Dados
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=sua_senha_mysql
    DB_PORT=3306
    DB_DIALECT=mysql
    DB_NAME=clean_academy

    # Chave Secreta para o JWT
    JWT_SECRET=seu-jwt-secret-super-seguro

    # Configurações do Servidor
    PORT=3000

    # Configurações do MinIO
    MINIO_ENDPOINT_URL=minio
    MINIO_PORT=9000
    MINIO_ROOT_USER=minioadmin
    MINIO_ROOT_PASSWORD=minioadmin
    MINIO_ACCESS_KEY=minioadmin
    MINIO_SECRET_KEY=minioadmin
    MINIO_BUCKET_NAME=clean-academy
    MINIO_BUCKET_URL=http://localhost:9000/clean-academy
    ```

4.  **Inicie o container do MinIO com Docker:**
    Este comando irá baixar e iniciar o serviço do MinIO definido no arquivo `docker-compose.yml`.
    ```bash
    docker-compose up -d
    ```

5.  **Configure o Banco de Dados e o MinIO:**
    * **MySQL:** Certifique-se de que seu servidor MySQL está rodando. Crie um banco de dados com o nome que você definiu na variável `DB_NAME` (ex: `clean_academy`).
    * **MinIO:** Acesse o console do MinIO em `http://localhost:9001`. Faça login com o `MINIO_ROOT_USER` e `MINIO_ROOT_PASSWORD` definidos no seu `.env`. Crie um novo *bucket* com o nome exato que você especificou em `MINIO_BUCKET_NAME`.

6.  **Execute as Migrations do Banco de Dados:**
    Este projeto usa o Prisma para a migração inicial. Execute o comando abaixo para criar as tabelas no seu banco de dados.
    ```bash
    npx prisma migrate dev --name init
    ```
    *(Nota: Embora o Prisma seja usado para a migração, o ORM principal para as operações do dia a dia é o Sequelize.)*

7.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```
    O servidor estará rodando em `http://localhost:3000`.

## 📚 Documentação da API (Swagger)

A documentação completa dos endpoints da API está disponível e é gerada automaticamente pelo Swagger. Após iniciar o servidor, acesse a seguinte URL no seu navegador:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Lá você poderá visualizar todas as rotas disponíveis, seus parâmetros, e até mesmo testá-las diretamente.

---
