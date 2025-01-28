import { Product } from "../models/associations.js";

const createProduct = (courseId, product) => {
    return Product.create({ ...product, courseId });
}

const getAllProducts = () => {
    return Product.findAll();
}

const getProductById = (id) => {
    return Product.findByPk(id);
}

const updateProduct = (id, product) => {
    return Product.update(product, { where: { id } });
}

const deleteProduct = (id) => {
    return Product.destroy({ where: { id } });
}

export { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };