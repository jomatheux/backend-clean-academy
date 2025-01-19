import Product from "../models/Product.js";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../services/productService.js";
import fs from "fs";

const removeOldImage = (product) => {
    if (!product.image) {
        console.log("Nenhuma imagem antiga para deletar.");
        return;
    }

    fs.unlink(product.image, (err) => {
        if (err) {
            console.error(`Erro ao deletar a imagem: ${err.message}`);
        } else {
            console.log(`Imagem antiga deletada com sucesso: ${product.image}`);
        }
    });
};

const productController = {
    // Criar um novo produto
    createProduct: async (req, res) => {
        const courseId = req.params.id;
        console.log(courseId);
        if (!courseId) return res.status(404).json("Curso não encontrado.");
        const { name, description } = await req.body;
        if (!name || !description) return res.status(400).json("Os dados do produto são obrigatórios.");
        const image = `src/public/products/${req.file.filename}`;
        console.log(image);
        console.log(req.file);

        const product = await createProduct(courseId, { name, image, description });
        res.status(201).json(product)
    },

    // Retornar todos os produtos
    getAllProducts: async (req, res) => {
        const products = await getAllProducts();
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
            image = `products/${req.file.filename}`;
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
    }
}

export default productController;