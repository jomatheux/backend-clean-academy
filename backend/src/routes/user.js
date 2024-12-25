import express from "express"

const router = express.Router();

import UserController from "../controllers/userController.js"

// middlewares
import verifyToken from "../middlewares/check-token.js";
// import { imageUpload }  from "../helpers/image-upload.js";

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/checkuser", UserController.checkUser);
router.get("/:id", UserController.getUserById);
// router.patch(
//   "/edit/:id",
//   verifyToken,
//   imageUpload.single("image"),
//   UserController.editUser
// );

export default router;