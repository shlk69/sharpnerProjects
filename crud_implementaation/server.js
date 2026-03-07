const express = require('express')
const app = express()
const studentRouter = require('./routes/students.routes')
const courseRouter = require('./routes/courses.routes')
app.get('/', (req, res) => {
    res.send("Welcome to the Student & Course Portal API!")
})

app.use('/students', studentRouter)
app.use('/students', studentRouter)


app.use('/courses', courseRouter)
app.use('/courses', courseRouter)

app.use((req, res) => {
    res.send("Invalid Route ")
})
app.listen(301, () => {
    console.log("Server is runnning on 301")
})