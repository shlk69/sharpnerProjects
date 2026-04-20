import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import db from './config/database.js';
import userRoutes from './routes/user.routes.js'


dotenv.config({ path: './.env' });
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.static('public'))
app.use(cors())

app.get('/', (req, res) => {
    res.send('Expense tracker is live')
})

app.use('/users',userRoutes)

db.sync({alter:true}).then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`)
    })
}).catch((err) => {
    console.log('Error while syncing the db',err)
})
