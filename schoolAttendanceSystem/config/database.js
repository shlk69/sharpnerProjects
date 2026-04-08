import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('school', 'root', 'Shl.SQL69', {
    host: 'localhost',
    dialect: 'mysql'
});

(async () => {
    try {
        await sequelize.authenticate()
        console.log('Connection is created successfully!')
    } catch (error) {
        console.log('Unable to create connection', error)
    }
})();

export default sequelize;