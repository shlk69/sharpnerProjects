import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import sequelize from './config/db.js';

import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.route.js';

dotenv.config();

const app = express();

const port = process.env.PORT || 8000;


// --------------------
// MIDDLEWARE
// --------------------

app.use(express.json());

app.use(cors());

app.use(express.static('public'));


// --------------------
// ROUTES
// --------------------

app.get('/', (req, res) => {
    res.send('Group chat app is online');
});

app.use('/api/users', userRoutes);

app.use('/api/chats', chatRoutes);


// --------------------
// DB + SERVER
// --------------------

(async () => {

    try {

        await sequelize.authenticate();

        await sequelize.sync();

        console.log('Successfully connected to DB');

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    } catch (error) {

        console.error('DB Connection Error:', error.message);
    }

})();