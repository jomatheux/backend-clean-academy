import express from 'express';
const router = express.Router();

//Rotas de usuários
import userRouter from './user.js';
router.use("/", userRouter);



export default router;