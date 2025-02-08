import express from "express"

const router = express.Router();

import UserController from "../controllers/UserController.js"
import authorizeAdmin from "../helpers/authorizeAdmin.js"

// middlewares
import verifyToken from "../helpers/check-token.js";
// import { imageUpload }  from "../helpers/image-upload.js";

router.post("/register", UserController.register); //admin
router.post("/login", UserController.login);
router.get("/checkuser", UserController.checkUser);
router.get("/:id", UserController.getUserById); //admin
router.get("/progress/:id", UserController.getProgressInCourse);
router.get("/users/progress/:id", UserController.getUserProgressInAllCoursesByUserId); //admin
router.post("/progress/:id", UserController.updateProgressInCourse);
router.get("/users/progress", UserController.getUsersProgress); //admin
router.post("/users/auth", authorizeAdmin); //admin
router.patch(
    "/edit/:id",
    UserController.editUserById); //admin
router.delete("/delete/:id", UserController.deleteUserById); //admin

export default router;