const { deleteById } = require('../models/products')
const Product = require('../models/products')

// SHOP
exports.getHome = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            res.render('shop/home', {
                pageTitle: 'Shop Name',
                prods: products,
                path: '/',
            })
        })
        .catch((err) => console.log(err))
}
exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            res.render('shop/product-list', {
                pageTitle: 'Products',
                prods: products,
                path: '/products',
            })
        })
        .catch((err) => console.log(err))
}
exports.getProductDetails = (req, res, next) => {
    const prodId = req.params.productId
    Product.findById(prodId)
        .then((product) => {
            res.render('shop/product-details', {
                product: product,
                pageTitle: product.title,
                path: '/products',
            })
        })
        .catch((err) => console.log(err))
}

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then((products) => {
            res.render('shop/cart', {
                pageTitle: 'Cart',
                path: '/cart',
                products: products,
            })
        })
        .catch((err) => console.log(err))
}
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId
    Product.findById(prodId)
        .then((product) => {
            req.user.addToCart(product)
        })
        .then((result) => {
            res.redirect('/cart')
        })
        .catch((err) => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    console.log('delete' + prodId)
    req.user
        .deleteItemFromCart(prodId)
        .then((result) => {
            res.redirect('/cart')
        })
        .catch((err) => console.log(err))
}

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders()
        .then((orders) => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders,
            })
        })
        .catch((err) => console.log(err))
}
exports.postOrder = (req, res, next) => {
    req.user
        .addOrder()
        .then((result) => res.redirect('/orders'))
        .catch((err) => console.log(err))
}

// exports.getCheckout = (req, res, next) => {
//     res.render('shop/checkout', { path: '/checkout', pageTitle: 'Checkout' })
// }
