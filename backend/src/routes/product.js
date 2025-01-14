import express from "express"
const router = express.Router();
import ProductController from "../controllers/ProductController.js"

router.post('/create', ProductController.createProduct);

router.get('/all', ProductController.getAllProducts);

router.get('/:id', ProductController.getProductById);

router.patch('/edit/:id', ProductController.updateProduct);

router.delete('/delete/:id', ProductController.deleteProduct);

export default router;