const Product = require('../models/products')

// SHOP
exports.getHome = (req, res, next) => {
    // Product.findAll()
    //     .then((products) => {
    //         res.render('shop/home', {
    //             pageTitle: 'Shop Name',
    //             prods: products,
    //             path: '/',
    //         })
    //     })
    // .catch((err) => console.log(err))
}
exports.getProducts = (req, res, next) => {
    // Product.findAll()
    //     .then((products) => {
    //         res.render('shop/product-list', {
    //             pageTitle: 'Products',
    //             prods: products,
    //             path: '/products',
    //         })
    //     })
    //     .catch((err) => console.log(err))
}
exports.getProductDetails = (req, res, next) => {
    // const prodId = req.params.productId
    // Product.findByPk(prodId)
    //     .then((product) => {
    //         res.render('shop/product-details', {
    //             product: product,
    //             pageTitle: product.title,
    //             path: '/products',
    //         })
    //     })
    //     .catch((err) => console.log(err))
}

exports.getCart = (req, res, next) => {
    // req.user
    //     .getCart()
    //     .then((cart) => {
    //         return cart
    //             .getProducts()
    //             .then((products) => {
    //                 res.render('shop/cart', {
    //                     pageTitle: 'Cart',
    //                     path: '/cart',
    //                     products: products,
    //                 })
    //             })
    //             .catch((err) => console.log(err))
    //     })
    //     .catch((err) => console.log(err))
}
exports.postCart = (req, res, next) => {
    // const prodId = req.body.productId
    // let fetchedCart
    // let newQuantity = 1
    // req.user
    //     //find user cart
    //     .getCart()
    //     .then((cart) => {
    //         fetchedCart = cart
    //         return cart.getProducts({ where: { id: prodId } })
    //     })
    //     //check if product exists in user cart
    //     .then((products) => {
    //         let product
    //         if (products.length > 0) {
    //             product = products[0]
    //         }
    //         //if it already exists in cart add 1
    //         if (product) {
    //             const oldQuantity = product.cartItem.quantity
    //             newQuantity = oldQuantity + 1
    //             return product
    //         }
    //         //else return product so it can be added next
    //         return Product.findByPk(prodId)
    //     })
    //     .then((product) => {
    //         //add item and new quantity to cart
    //         return fetchedCart.addProduct(product, {
    //             through: {
    //                 quantity: newQuantity,
    //             },
    //         })
    //     })
    //     .then(() => {
    //         res.redirect('/cart')
    //     })
    //     .catch((err) => console.log(err))
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
            console.log(orders)
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders,
            })
        })
        .catch((err) => console.log(err))
}
exports.postOrder = (req, res, next) => {
    let orderProducts
    let fetchedCart
    req.user
        .getCart()
        //get products from cart
        .then((cart) => {
            fetchedCart = cart
            return cart.getProducts()
        })
        //create order
        .then((products) => {
            orderProducts = products
            return req.user.createOrder()
        })
        // add products to order
        .then((order) => {
            return order.addProducts(
                // sequelize needs unique orderItem value (not quantity), which we added in the DB. replacing quantity w/ orderItem
                orderProducts.map((product) => {
                    product.orderItem = {
                        quantity: product.cartItem.quantity,
                    }
                    return product
                })
            )
        })
        .then(() => {
            return fetchedCart.setProducts(null)
        })
        .then(() => res.redirect('/orders'))
        .catch((err) => console.log(err))
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', { path: '/checkout', pageTitle: 'Checkout' })
}
