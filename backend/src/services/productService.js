import { Product } from "../models/associations.js";

class ProductService {
    constructor(productModel) {
        this.productModel = productModel;
    }

    async createProduct(courseId, product) {
        return this.productModel.create({ ...product, courseId });
    }

    async getAllProducts() {
        return this.productModel.findAll();
    }

    async getProductById(id) {
        return this.productModel.findByPk(id);
    }

    async updateProduct(id, product) {
        return this.productModel.update(product, { where: { id } });
    }

    async deleteProduct(id) {
        return this.productModel.destroy({ where: { id } });
    }
}

export default new ProductService(Product);