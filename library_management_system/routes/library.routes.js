const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send("Here is the list of all books")
})
router.post('/', (req, res) => {
    console.log("Post request has been made")
    res.send("A book has been added")
})

module.exports = router