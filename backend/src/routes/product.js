import express from "express"
const router = express.Router();
import ProductController from "../controllers/ProductController.js"
import upload from "../helpers/upload.js";

router.post('/create/:id', upload.single("image"), (req, res, next) => {
    const image = req.file;
    if (!image) {
        return res.status(400).json({ message: "Por favor, envie um arquivo." });
    }
    next();
}, ProductController.createProduct); //admin

router.get('/all', ProductController.getAllProducts);

router.get('/:id', ProductController.getProductById);

router.get('/course/:id', ProductController.getCourseProducts);

router.patch('/edit/:id', upload.single("image"), ProductController.updateProduct); //admin

router.delete('/delete/:id', ProductController.deleteProduct); //admin

export default router;