import express from "express";

const router = express.Router();

import UserController from "../controllers/UserController.js";

import authorizeAdmin from "../helpers/authorizeAdmin.js";
import checkToken from "../helpers/check-token.js";
import upload from "../helpers/upload.js";
// import { imageUpload }  from "../helpers/image-upload.js";

router.post("/register", authorizeAdmin, upload.single("image"), UserController.register); //admin

router.post("/login", UserController.login);

router.get("/checkuser", checkToken, UserController.checkUser);

router.get("/:id", authorizeAdmin, UserController.getUserById); //admin

router.post("/users/auth", authorizeAdmin, async (req, res) => {
    res.json({ message: "Admin authenticated" });
}); //admin

router.patch(
    "/edit/:id",
    authorizeAdmin,
    upload.single("image"),
    UserController.editUserById); //admin

router.delete("/delete/:id", authorizeAdmin, UserController.deleteUserById); //admin

export default router;