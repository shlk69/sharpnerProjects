const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send("Hey there the dynamics are here")
})

app.get('/welcome/:user', (req, res) => {
    const user = req.params.user
    const role = req.query.role
    res.send(`Hello ${user} Your role is ${role} !`)
})

app.listen(300, () => {
    console.log("server is running on 300")
})