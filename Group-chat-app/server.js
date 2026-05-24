import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/db.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.send('Group chat app is online');
});

app.use('/api/users', userRoutes);

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Successfully connected to DB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (e) {
        console.error('Error while connecting to DB:', e.message);
    }
})();
