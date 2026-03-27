import { Sequelize } from "sequelize";

const sequelize = new Sequelize('bookingappointment', 'root', 'Shl.SQL69', {
    host: 'localhost',
    dialect: 'mysql'
});

(async () => {
    try {
        await sequelize.authenticate()
        console.log('DB connection created')
    } catch (error) {
        console.log('Unable to create DB connection')
    }
})


export default sequelize