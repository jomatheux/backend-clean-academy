import express from "express"
const router = express.Router();
import ProductController from "../controllers/ProductController.js"
import upload from "../helpers/upload.js";

import authorizeAdmin from "../helpers/authorizeAdmin.js";
import checkToken from "../helpers/check-token.js";

router.post('/create/:id', authorizeAdmin, upload.single("image"), (req, res, next) => {
    const image = req.file;
    if (!image) {
        return res.status(400).json({ message: "Por favor, envie um arquivo." });
    }
    next();
}, ProductController.createProduct); //admin

router.get('/all', checkToken, ProductController.getAllProducts);

router.get('/:id', checkToken, ProductController.getProductById);

router.get('/course/:id', checkToken, ProductController.getCourseProducts);

router.patch('/edit/:id', authorizeAdmin, upload.single("image"), ProductController.updateProduct); //admin

router.delete('/delete/:id', authorizeAdmin, ProductController.deleteProduct); //admin

export default router;