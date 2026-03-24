import mysql from 'mysql2'

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Shl.SQL69',
    database: 'testdb'
})

connection.connect((err) => {
    if (err) {
        console.log("Error occured : ", err.message)
        return
    }
    console.log('connection has been created')

    const queryConnection = `create table IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20),
    email VARCHAR(30)
    )`

    connection.execute(queryConnection, (err) => {
        if (err) {
            console.log('cannot create table', err.message);
            connection.end()
            return
        }
        console.log('Table created successfully ');
    })
})


export default connection