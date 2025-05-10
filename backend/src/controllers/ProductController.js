import Product from "../models/Product.js";
import productService from "../services/productService.js";
import removeOldImage from "../helpers/removeOldImage.js";
import deleteObjectMinioByUrl from "../helpers/deleteObjectS3ByUrlV3MinIO.js"

class ProductController {
    constructor(productService) {
        this.productService = productService;
    }

    async createProduct(req, res) {
        const courseId = req.params.courseId;
        if (!courseId) return res.status(404).json("Curso não encontrado.");
        const { name, description } = await req.body;
        if (!name || !description) return res.status(400).json("Os dados do produto são obrigatórios.");
        const image = `${process.env.MINIO_BUCKET_URL}/product/${req.file.filename}`;

        const product = await this.productService.createProduct(courseId, { name, image, description });
        res.status(201).json(product);
    }

    async getAllProducts(req, res) {
        const products = await this.productService.getAllProducts();
        console.log(products);
        if (!products) return res.status(404).json("Nenhum produto encontrado.");
        res.json(products);
    }

    async getProductById(req, res) {
        const { id } = req.params;
        const product = await this.productService.getProductById(id);
        if (!product) return res.status(404).json("Produto não encontrado.");
        res.json(product);
    }

    async updateProduct(req, res) {
        const { id } = req.params;
        const { title, description } = req.body;
        let oldImage = await Product.findByPk(id).then(p => p.image);
        let image = oldImage;
        if (req.file) {
            image = `${process.env.MINIO_BUCKET_URL}/product/${req.file.filename}`;
        }
        const data = { title, description, image };
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado!' });
        }
        if (image !== oldImage) {
            deleteObjectMinioByUrl(oldImage);
        }
        const updatedProduct = await this.productService.updateProduct(id, data);
        if (!updatedProduct) return res.status(404).json("Produto não encontrado.");
        res.json(updatedProduct);
    }

    async deleteProduct(req, res) {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ error: 'Produto não encontrado!' });
        deleteObjectMinioByUrl(product.image);
        const deletedProduct = await this.productService.deleteProduct(id);
        if (!deletedProduct) return res.status(404).json("Produto não encontrado.");
        res.status(204).send();
    }

    async getCourseProducts(req, res) {
        const { courseId } = req.params;
        const products = await Product.findAll({ where: { courseId: courseId } });
        if (!products) return res.status(404).json("Nenhum produto encontrado.");
        res.json(products);
    }

    async getCourseProductById(req, res) {
        const { courseId, productId } = req.params;
        const product = await Product.findByPk(productId, { where: { courseId: courseId } });
        if (!product) return res.status(404).json("Produto não encontrado.");
        res.json(product);
    }
}

export default new ProductController(productService);