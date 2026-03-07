const express = require('express')
const app = express()
const libraryRouter = require('./routes/library.routes')

app.get('/', (req, res) => {
    res.send("Library management system !")
})


app.use('/books',libraryRouter)
app.listen(3000, () => {
    console.log("Server is running on 3000")
})