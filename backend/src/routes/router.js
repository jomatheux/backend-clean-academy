import express from 'express';
const router = express.Router();

//Rotas de usuários
import userRouter from './user.js';
router.use("/", userRouter);

//Rotas de cursos
import courseRouter from './course.js';
router.use("/courses", courseRouter);

import testRouter from './test.js';
router.use("/tests", testRouter);


export default router;