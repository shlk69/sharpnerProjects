import express from 'express'
import cors from 'cors'
import db from './config/database.js'
import expenseRoutes from './routes/expenseRoutes.js'
const app = express()


app.use(express.json())
app.use(cors())
app.use(express.static('public'))

app.use('/expenses',expenseRoutes)

db.sync({ alter: true }).then(() => {
    app.listen(3000, () => {
        console.log('server is running on port 3000');
        
    })
}).catch((err) => {
    console.log('Unable to run server',err)
})
