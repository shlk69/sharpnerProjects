import { Sequelize } from "sequelize";

const sequelize = new Sequelize('testdb', 'root', 'Shl.SQL69', {
    host: 'localhost',
    dialect: 'mysql'
});


// ✅ Fixed: added () at the end to actually invoke the async function
(async () => {
    try {
        await sequelize.authenticate()
        console.log('DB connection created')
    } catch (error) {
        console.log('Unable to create DB connection')
    }
})()

export default sequelize