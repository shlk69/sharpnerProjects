const express = require('express')
const { route } = require('./users.routes')
const router = express.Router()


router.get('/', (req, res) => {
    res.send("Fetching all products")
})

router.post('/', (req, res) => {
    res.send("Adding a product")
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    res.send(`Fetching product with id ${id}`)
})

module.exports = router