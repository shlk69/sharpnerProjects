const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cart.controller')

router.get('/:id', cartController.getCartUserById)

router.post('/:id', cartController.addCartUserById)

module.exports = router