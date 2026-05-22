import express from 'express'
import dotenv from 'dotenv'
import  sequelize  from './config/db.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.send('Group chat app is online')
});

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

