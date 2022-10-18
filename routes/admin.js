const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin')
const productsController = require('../controllers/shop')

router.get('/products', adminController.getProducts)

router.get('/add-product', adminController.getAddProduct)
router.post('/add-product', adminController.postAddProduct)

router.get('/edit-product/:productId', adminController.getEditProducts)
router.post('/edit-product', adminController.postEditProducts)

router.post('/delete-product', adminController.postDeleteProduct)

exports.router = router
