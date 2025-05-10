import express from "express"
const router = express.Router();
import ProductController from "../controllers/ProductController.js"
import upload from "../helpers/upload.js";
import uploadMinIO from "../helpers/uploadMinIO.js";

import authorizeAdmin from "../helpers/authorizeAdmin.js";
import checkToken from "../helpers/check-token.js";

router.post('/:courseId', authorizeAdmin, uploadMinIO("image"), (req, res, next) => {
    const image = req.file;
    if (!image) {
        return res.status(400).json({ message: "Por favor, envie um arquivo." });
    }
    next();
}, ProductController.createProduct.bind(ProductController)); //admin

router.get('/', checkToken, ProductController.getAllProducts.bind(ProductController));

router.get('/:id', checkToken, ProductController.getProductById.bind(ProductController));

router.get('/course/:courseId', checkToken, ProductController.getCourseProducts.bind(ProductController));

router.patch('/:id', authorizeAdmin, uploadMinIO("image"), ProductController.updateProduct.bind(ProductController)); //admin

router.delete('/:id', authorizeAdmin, ProductController.deleteProduct.bind(ProductController)); //admin

export default router;