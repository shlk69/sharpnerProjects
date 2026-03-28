import { Sequelize } from "sequelize";


const sequelize = new Sequelize('testdb', 'root', 'Shl.SQL69', {
    host: 'localhost',
    dialect: 'mysql'
});


(async () => {
    try {
        await sequelize.authenticate()
        console.log('Connection is stablized')
    } catch (error) {
        console.log(error)
    }

})()

export default sequelize

