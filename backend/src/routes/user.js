import express from "express";

const router = express.Router();

import UserController from "../controllers/UserController.js";

import authorizeAdmin from "../helpers/authorizeAdmin.js";
import checkToken from "../helpers/check-token.js";
import upload from "../helpers/upload.js";
import uploadMinIO from "../helpers/uploadMinIO.js";

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Registra um novo usuário
 *     description: Registra um novo usuário no sistema
 */
router.post("/register", authorizeAdmin, uploadMinIO("image"), UserController.register.bind(UserController)); //admin

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Login do usuário
 *     description: Gera um token JWT para o usuário
 */
router.post("/login", UserController.login.bind(UserController));

/**
 * @swagger
 * /checkuser:
 *   get:
 *     tags:
 *       - Users
 *     summary: Verifica o token JWT do usuário
 *     description: Retorna os dados do usuário autenticado
 */
router.get("/checkuser", checkToken, UserController.checkUser.bind(UserController));

/**
 * @swagger
 * /{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Busca um usuário pelo ID
 *     description: Retorna os dados de um usuário específico
 */
router.get("/:id", authorizeAdmin, UserController.getUserById.bind(UserController)); //admin

/**
 * @swagger
 * /edit/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Edita um usuário
 *     description: Atualiza os dados de um usuário específico
 */
router.post("/auth", authorizeAdmin, async (req, res) => {
    res.json({ message: "Admin authenticated" });
}); //admin

/**
 * @swagger
 * /edit/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Edita um usuário
 *     description: Atualiza os dados de um usuário específico
 */
router.patch(
    "/:id",
    authorizeAdmin,
    uploadMinIO("image"),
    UserController.editUserById.bind(UserController)); //admin

/**
 * @swagger
 * /delete/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Deleta um usuário
 *     description: Remove um usuário do sistema
 */
router.delete("/:id", authorizeAdmin, UserController.deleteUserById.bind(UserController)); //admin

/**
 * @swagger
 * /logout:
 *   post:
 *     tags:
 *       - Users
 *     summary: Logout do usuário
 *     description: Encerra a sessão do usuário
 */
router.post("/logout", checkToken, UserController.logout.bind(UserController));

export default router;