const express = require('express')
const app = express()
const userRouter = require('./routes/users.routes')
const cartRouter = require('./routes/cart.routes')
const productRouter = require('./routes/products.routes')
app.get("/", (req, res) => {
    res.send("The E-commerce start-up is here !")
})


app.use(express.static('public'))
app.use(express.json())


app.use("/users",userRouter)
app.use("/products", productRouter)
app.use("/cart", cartRouter)
app.listen(302, () => {
    console.log("sever is runnin on 302")
})