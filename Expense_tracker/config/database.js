import 'dotenv/config'; 
import { Sequelize } from "sequelize";


const connection = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql'
    }
);

(async () => {
    try {
        await connection.authenticate();
        console.log('DB is connected successfully.');
    } catch (error) {
        console.error('Error while connecting:', error);
    }
})();

export default connection;
