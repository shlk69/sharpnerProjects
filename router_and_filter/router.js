const express = require('express')
const app = express()
const orderRouter = require('./routes/orderRouter')
const userRouter = require('./routes/userRouter')

app.get('/', (req, res) => {
    res.send("Hey there , routes in action")
})

app.use('/users',userRouter)

app.use('/orders',orderRouter)

app.listen(3000, () => {
    console.log("server is running on port 3000")
})