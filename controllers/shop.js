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
        .then(() => {
            res.redirect('/cart')
        })
        .catch((err) => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    req.user
        .getCart()
        .then((cart) => {
            return cart.getProducts({ where: { id: prodId } })
        })
        .then((products) => {
            const product = products[0]
            return product.cartItem.destroy()
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch((err) => console.log(err))
}

exports.getOrders = (req, res, next) => {
    req.user
        // need to add products list to order to pull product data.
        // include, tells sequelize to also pull the products list with the order fetch
        // sequelize pluralizes the one order to many product(s)
        .getOrders({ include: ['products'] })
        .then((orders) => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders,
            })
        })
        .catch((err) => console.log(err))
}
// exports.postOrder = (req, res, next) => {
//     let orderProducts
//     let fetchedCart
//     req.user
//         .getCart()
//         //get products from cart
//         .then((cart) => {
//             fetchedCart = cart
//             return cart.getProducts()
//         })
//         //create order
//         .then((products) => {
//             orderProducts = products
//             return req.user.createOrder()
//         })
//         // add products to order
//         .then((order) => {
//             return order.addProducts(
//                 // sequelize needs unique orderItem value (not quantity), which we added in the DB. replacing quantity w/ orderItem
//                 orderProducts.map((product) => {
//                     product.orderItem = {
//                         quantity: product.cartItem.quantity,
//                     }
//                     return product
//                 })
//             )
//         })
//         .then(() => {
//             return fetchedCart.setProducts(null)
//         })
//         .then(() => res.redirect('/orders'))
//         .catch((err) => console.log(err))
// }

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', { path: '/checkout', pageTitle: 'Checkout' })
}
