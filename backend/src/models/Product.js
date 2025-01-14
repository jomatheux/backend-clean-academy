import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING, // Descrição do produto
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true, // URL da imagem do produto
    }
}, {
    timestamps: true,
    tableName: 'tb_products',
});

export default Product;