import express from 'express'
import db from './utils/db-connection.js'
import busRouter from './routes/busRoutes.js'
import userRoutes from './routes/userRoutes.js'
import bookingRoutes from './routes/bookingRoutes.js'
const app = express()

app.use(express.json())


app.use('/users', userRoutes);
app.use('/buses', busRouter);
app.use('/bookings', bookingRoutes);
app.get('/', (req, res) => {
    res.send("Bus booking system is online !")
})

db.sync({ alter: true }).then(() => {
    app.listen(3000, () => {
        console.log('server is running on http://localhost:3000');
    })
}).catch((err) => {
    console.log('Unable to sync DB ',err)
})