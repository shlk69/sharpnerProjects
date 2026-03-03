const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send("Hey there , routes in action")
})

app.get('/users', (req, res) => {
    res.send("Here is the list of all users")
})

app.post("/users", (req, res) => {
    res.send("A new user has been added")
})


app.get('/orders', (req, res) => {
    res.send("Here is the list of all orders")
})

app.post("/orders", (req, res) => {
    res.send("A new order has been added")
})

app.listen(3000, () => {
    console.log("server is running on port 3000")
})