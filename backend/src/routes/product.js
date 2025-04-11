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
}, ProductController.createProduct.bind(ProductController)); //admin

router.get('/all', checkToken, ProductController.getAllProducts.bind(ProductController));

router.get('/:id', checkToken, ProductController.getProductById.bind(ProductController));

router.get('/course/:id', checkToken, ProductController.getCourseProducts.bind(ProductController));

router.patch('/edit/:id', authorizeAdmin, upload.single("image"), ProductController.updateProduct.bind(ProductController)); //admin

router.delete('/delete/:id', authorizeAdmin, ProductController.deleteProduct.bind(ProductController)); //admin

export default router;