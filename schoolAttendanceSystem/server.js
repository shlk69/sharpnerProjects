import express from 'express';
import sequelize from './config/database.js';
import attendanceRoutes from './routes/attendanceRoutes.js';


const app = express();
app.use(express.json());
app.use(express.static('public'));

app.use('/api/attendance', attendanceRoutes);


sequelize.sync({alter:true}).then(() => {
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
}).catch(err => console.log('Error: ' + err));