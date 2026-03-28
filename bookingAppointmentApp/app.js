import express from 'express';
import cors from 'cors';
import sequelize from './utils/db.js';
import './models/appointmentModel.js';
import bodyParser from 'body-parser';
import appointmentRoutes from './routes/appointmentRoutes.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api/appointments', appointmentRoutes);

sequelize.sync({ alter: true }).then(() => {
    console.log("DB synced");
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}).catch((err) => {
    console.log("Sync error:", err);
});