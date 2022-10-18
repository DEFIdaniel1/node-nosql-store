const express = require('express')

const { router: adminRoutes } = require('./routes/admin')
const shopRouter = require('./routes/shop')
const errorController = require('./controllers/error')

// Express and template setup
const app = express()
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

// DB & Relations
const sequelize = require('./utils/database')
const Product = require('./models/products')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
User.hasOne(Cart)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, { through: OrderItem })

// Get user data
app.use((req, res, next) => {
    User.findByPk(1)
        .then((user) => {
            //sequelize user object added (has all sequalize methods)
            req.user = user
            next()
        })
        .catch((err) => console.log(err))
})

// ROUTES
app.use('/admin', adminRoutes)
app.use(shopRouter)
app.use(errorController.get404)

sequelize
    // .sync({ force: true })
    .sync()
    .then((result) => {
        return User.findByPk(1)
    })
    .then((user) => {
        if (!user) {
            User.create({ name: 'daniel', email: 'test@test.com' })
        }
        return user
    })
    .then((user) => {
        user.createCart()
    })
    .then((user) => {
        app.listen(3000)
    })
    .catch((err) => {
        console.log(err)
    })
