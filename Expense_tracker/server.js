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
app.get('/reset-password', (req, res) => {
    res.sendFile('index.html', { root: 'public' })
})



app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    })
})



async function startServer() {
    try {
        await db.authenticate()
        await db.sync()
        console.log("Database connected successfully")
    } catch (error) {
        console.log("DB failed:", error.message)
    }

    // ALWAYS start server
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`)
    })
}

startServer()
