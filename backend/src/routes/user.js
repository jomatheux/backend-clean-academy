import express from "express"

const router = express.Router();

import UserController from "../controllers/UserController.js"

// middlewares
import verifyToken from "../helpers/check-token.js";
// import { imageUpload }  from "../helpers/image-upload.js";

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/checkuser", UserController.checkUser);
router.get("/:id", UserController.getUserById);
router.get("/progress/:id", UserController.getProgressInCourse);
router.post("/progress/:id", UserController.updateProgressInCourse);
router.get("/users/progress", UserController.getUsersProgress);
// router.patch(
//   "/edit/:id",
//   verifyToken,
//   imageUpload.single("image"),
//   UserController.editUser
// );

export default router;