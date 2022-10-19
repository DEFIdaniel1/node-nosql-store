const Product = require('../models/products')
const mongodb = require('mongodb')

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then((products) => {
            res.render('admin/products', {
                pageTitle: 'Products',
                prods: products,
                path: '/admin/products',
            })
        })
        .catch((err) => console.log(err))
}

exports.getAddProduct = (req, res, next) => {
    // non-Express method: res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
    res.render('admin/edit-product', {
        pageTitle: 'Admin Page',
        path: '/admin/add-product',
        editing: false,
    })
}
exports.postAddProduct = (req, res, next) => {
    const product = new Product(
        req.body.title,
        req.body.price,
        req.body.description,
        req.body.imageUrl,
        null, //product Id
        req.user._id
    )
    product
        .save()
        .then(() => {
            console.log('Created new product')
            res.redirect('/')
        })
        .catch((err) => {
            console.log(err)
        })
}

exports.getEditProducts = (req, res, next) => {
    const editMode = req.query.edit
    if (!editMode === 'true') {
        return res.redirect('/')
    }
    const prodId = req.params.productId
    Product.findById(prodId)
        .then((product) => {
            if (!product) {
                redirect('/')
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
            })
        })
        .catch((err) => console.log(err))
}
exports.postEditProducts = (req, res, next) => {
    const prodId = req.body.productId
    const product = new Product(
        req.body.title,
        req.body.price,
        req.body.description,
        req.body.imageUrl,
        mongodb.ObjectId(prodId)
    )
    product
        .save()
        .then(() => res.redirect('/admin/products'))
        .catch((err) => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    Product.deleteById(prodId)
        .then(() => res.redirect('/admin/products'))
        .catch((err) => console.log(err))
}
