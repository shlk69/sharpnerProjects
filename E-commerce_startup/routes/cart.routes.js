const express = require('express')
const { route } = require('./users.routes')
const router = express.Router()


router.get('/:id', (req, res) => {
    const id = req.params.id
    res.send(`Fetching cart for user with ID : ${id}`)
})

router.post('/:id', (req, res) => {
    const id = req.params.id
    res.send(`Adding product to cart for user with ID:${id}`)
})

module.exports = router