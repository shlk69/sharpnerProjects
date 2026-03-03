const express = require('express')
const app = express()


function addUser(req, res,next){
    req.user = "Sahil"
    next()
}

app.use('/welcome', addUser ,(req, res, next) =>{
    res.send(`<h1>Welcome ${req.user}!</h1>`)
    next()
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
});