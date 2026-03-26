import express from 'express'
import db from './utils/db-connection.js';
import studentRoutes from './routes/studentsRoutes.js'
import studentModel from './models/studentsModel.js'
const app = express()


app.use(express.json())
app.use('/students',studentRoutes)
app.get('/', (req, res) => {
    res.send('Hello worlds')
})


db.sync({force:true}).then(() => {
    app.listen(3000, () => {
        console.log('server is running on http://localhost:3000 ');
    })
}).catch((err) => {
    console.log(`Server is crashed due to : ${err}`)
})


