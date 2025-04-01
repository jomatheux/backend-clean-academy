import Product from "../models/Product.js";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../services/productService.js";
import removeOldImage from "../helpers/removeOldImage.js";

const productController = {
    // Criar um novo produto
    createProduct: async (req, res) => {
        const courseId = req.params.id;
        if (!courseId) return res.status(404).json("Curso não encontrado.");
        const { name, description } = await req.body;
        if (!name || !description) return res.status(400).json("Os dados do produto são obrigatórios.");
        const image = `product/${req.file.filename}`;

        const product = await createProduct(courseId, { name, image, description });
        res.status(201).json(product)
    },

    // Retornar todos os produtos
    getAllProducts: async (req, res) => {
        const products = await getAllProducts();
        console.log(products);
        if (!products) return res.status(404).json("Nenhum produto encontrado.");
        res.json(products)
    },

    // Retornar um produto específico
    getProductById: async (req, res) => {
        const { id } = req.params;
        const product = await getProductById(id);
        if (!product) return res.status(404).json("Produto não encontrado.");
        res.json(product)
    },

    // Atualizar um produto
    updateProduct: async (req, res) => {
        const { id } = req.params;
        const { title, description } = req.body;
        let image = null;
        if (req.file) {
            image = `product/${req.file.filename}`;
        }
        const data = { title, description, image };
        const product = await Product.findByPk(id)
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado!' });
        }
        if (image) {
            removeOldImage(product);
        }
        const updatedProduct = await updateProduct(id, data);
        if (!updatedProduct) return res.status(404).json("Produto não encontrado.");
        res.json(updatedProduct)
    },

    // Deletar um produto
    deleteProduct: async (req, res) => {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ error: 'Produto não encontrado!' });
        removeOldImage(product);
        const deletedProduct = await deleteProduct(id);
        if (!deletedProduct) return res.status(404).json("Produto não encontrado.");
        res.status(204).send()
    },

    // Retornar todos os produtos de um curso específico
    getCourseProducts: async (req, res) => {
        const { id } = req.params;
        const products = await Product.findAll({ where: { courseId: id } });
        if (!products) return res.status(404).json("Nenhum produto encontrado.");
        res.json(products)
    },

    // Retornar um produto específico de um curso específico
    getCourseProductById: async (req, res) => {
        const { courseId, productId } = req.params;
        const product = await Product.findByPk(productId, { where: { courseId: courseId } });
        if (!product) return res.status(404).json("Produto não encontrado.");
        res.json(product)
    },
}

export default productController;