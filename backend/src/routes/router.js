import express from 'express';
const router = express.Router();

//Rotas de usuários
import userRouter from './user.js';
router.use("/", userRouter);

//Rotas de cursos
import courseRouter from './course.js';
router.use("/courses", courseRouter);

//Rotas de testes
import testRouter from './test.js';
router.use("/tests", testRouter);

//Rotas de produtos
import productRouter from './product.js';
router.use("/products", productRouter);


export default router;