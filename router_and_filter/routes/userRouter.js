const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send("User List")
})

router.post('/', (req, res) => {
    res.send("User Created")
})

module.exports = router