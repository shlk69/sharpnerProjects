import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import db from './config/database.js'

import userRoutes from './routes/user.routes.js'
import expenseRoutes from './routes/expense.routes.js'
import premiumRoutes from './routes/premium.routes.js'

dotenv.config({ path: './.env' })

const app = express()
const PORT = process.env.PORT || 8000


app.use(cors())
app.use(express.json())
app.use(express.static('public'))



app.get('/', (req, res) => {
    res.status(200).send('Expense Tracker API is live')
})



app.use('/users', userRoutes)
app.use('/expenses', expenseRoutes)
app.use('/premium', premiumRoutes)



app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    })
})



async function startServer() {
    try {
        await db.authenticate()
        console.log('Database connected successfully')

        await db.sync()
        console.log('Database synced successfully')

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`)
        })

    } catch (error) {
        console.log('Server startup failed:', error.message)
    }
}

startServer()
