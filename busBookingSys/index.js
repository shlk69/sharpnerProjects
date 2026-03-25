import express from 'express'
import db from './utils/db-connection.js'
import busRouter from './routes/busRoutes.js'
import userRoutes from './routes/userRoutes.js'
const app = express()

app.use(express.json())


app.use('/buses', busRouter)
app.use('/users',userRoutes)
app.get('/', (req, res) => {
    res.send("Bus booking system is online !")
})

app.listen(3000, () => {
    console.log('server is running on http://localhost:3000');
})