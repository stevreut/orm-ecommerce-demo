// import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product model (table) by extending off Sequelize's Model class
class Product extends Model {}

// set up fields and rules for Product model
Product.init(
  {
    // define columns
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
      // TODO - no null, linkage
    },
    product_name: {
      type: DataTypes.STRING
      // TODO - no null
    },
    price: {
      type: DataTypes.DECIMAL
      // TODO - no null
      // TODO - value is decimal
      // TODO - (not in req., but require >= 0?)
    },
    stock: {
      type: DataTypes.INTEGER
      // TODO - no null
      // TODO - default to 10
      // TODO - validate as numeric
    },
    category_id: {
      type: DataTypes.INTEGER
      // TODO - link to id of category
      // TODO - CAN be null (nothing needs be done - default behavior?)
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;
