import express from 'express';
const router = express.Router();


import userRouter from './user.js';
//Rotas de usuários
/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Users
 */
router.use("/", userRouter);


import courseRouter from './course.js';
//Rotas de cursos
/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Courses
 */
router.use("/courses", courseRouter);


import testRouter from './test.js';
//Rotas de testes
/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Tests
 */
router.use("/tests", testRouter);


import productRouter from './product.js';
//Rotas de produtos
/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Products
 */
router.use("/products", productRouter);


import reportRouter from './report.js';
//Rotas de relatórios
/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Reports
 */
router.use("/reports", reportRouter);


export default router;