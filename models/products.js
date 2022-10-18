const Sequelize = require('sequelize')
//imports class constructor for use

const sequelize = require('../utils/database')
//imports database connection

const Product = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: { type: Sequelize.STRING, allowNull: false },
    price: { type: Sequelize.DOUBLE, allowNull: false },
    imageUrl: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.STRING, allowNull: false },
})

module.exports = Product
