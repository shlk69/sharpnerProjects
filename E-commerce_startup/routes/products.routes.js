const express = require('express')
const router = express.Router()
const productController = require('../controllers/products.controllers')

router.get('/', productController.getProducts)

router.post('/',productController.addProduct)

router.get('/:id', productController.getProductsById)


module.exports = router