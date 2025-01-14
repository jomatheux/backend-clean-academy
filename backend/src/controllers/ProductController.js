import Product from "../models/Product.js";
import {createProduct, getAllProducts, getProductById, updateProduct, deleteProduct} from "../services/productService.js";

const productController = {
    // Criar um novo produto
    createProduct: async (req, res) => {
        const data = await req.body;
        const product = await createProduct(data);
        res.status(201).json(product)
    },
    
    // Retornar todos os produtos
    getAllProducts: async (req, res) => {
        const products = await getAllProducts();
        if(!products) return res.status(404).json("Nenhum produto encontrado.");
        res.json(products)
    },
    
    // Retornar um produto específico
    getProductById: async (req, res) => {
        const {id} = req.params;
        const product = await getProductById(id);
        if(!product) return res.status(404).json("Produto não encontrado.");
        res.json(product)
    },
    
    // Atualizar um produto
    updateProduct: async (req, res) => {
        const {id} = req.params;
        const data = await req.body;
        const updatedProduct = await updateProduct(id, data);
        if(!updatedProduct) return res.status(404).json("Produto não encontrado.");
        res.json(updatedProduct)
    },
    
    // Deletar um produto
    deleteProduct: async (req, res) => {
        const {id} = req.params;
        const deletedProduct = await deleteProduct(id);
        if(!deletedProduct) return res.status(404).json("Produto não encontrado.");
        res.status(204).send()
    }
}

export default productController;