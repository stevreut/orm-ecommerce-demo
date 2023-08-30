const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class ProductTag extends Model {}

ProductTag.init(
  {
    // define columns
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
      // TODO - no null, linkage
    },
    product_id: {
      type: DataTypes.INTEGER
      // TODO - link to id of product
    },
    tag_id: {
      type: DataTypes.INTEGER
      // TODO - link to id of tag
    }
    // NOTE / TODO - the above enable many-to-many linkage
    // between product and tag
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
