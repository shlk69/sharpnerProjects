const express = require('express')
const app = express()


app.get('/', (req, res) => {
    res.send("Hey there , routes in action")
})

app.get('/products', (req, res) => {
    res.send("Here is the list of all products")
})

app.post("/products", (req, res) => {
    res.send("A new product has been added")
})


app.get('/categories', (req, res) => {
    res.send("Here is the list of all categories")
})

app.post("/categories", (req, res) => {
    res.send("A new category has been created")
})

app.get("/*splat", (req, res) => {
    res.status(404).send(`<h1>Route not found</h1>`)
})

app.listen(3000, () => {
    console.log("server is running on port 3000")
})