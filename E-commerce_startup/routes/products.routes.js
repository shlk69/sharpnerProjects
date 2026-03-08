const express = require('express')
const router = express.Router()
const productController = require('../controllers/products.controllers')

router.get('/', productController.getProducts)

router.post('/',productController.addProduct)

router.get('/:id', productController.getProductsById)

router.put('/:id',productController.updateProductsById)


router.delete('/:id',productController.delProductsById)

module.exports = router