const express = require('express')
const router = express.Router()
const userController = require('../controllers/users.controller')

router.get('/', userController.getAllUsers)

router.post('/',userController.addUser)


module.exports = router