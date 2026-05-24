import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import sequelize from './config/db.js'
import userRoutes from './routes/user.routes.js'


dotenv.config()
const app = express()
const port = process.env.PORT || 3000

//middlewares
app.use(express.json())
app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send('Group chat app is online')
});

//user routes
app.use('/api/users',userRoutes)

(async () => {
try {
    await sequelize.authenticate()
    await sequelize.sync()
    console.log('successfully connected to db')
    app.listen(port, () => {
        console.log('server is running on port ',port)
    })
} catch (error) {
    console.log('Error while connceting to db ',error.message)
    }
        
})()

