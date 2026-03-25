import mysql from 'mysql2'

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Shl.SQL69',
    database: 'testdb',
    multipleStatements: true
})

connection.connect((err) => {
    if (err) {
        console.log('Error occured : ', err.message)
        return
    }
    console.log('Connection is created')
    const connectionQuery = `create table IF NOT EXISTS Users(
     id INT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(20),
     email VARCHAR(20)
    );

    CREATE TABLE IF NOT EXISTS Buses (
     id INT PRIMARY KEY AUTO_INCREMENT,
     busNumber INT,
     totalSeats INT,
     availableSeats INT
);

    create table IF NOT EXISTS Bookings(
     id INT PRIMARY KEY AUTO_INCREMENT,
     seatNumber INT NOT NULL
    );
     
    create table IF NOT EXISTS Payments(
     id INT PRIMARY KEY AUTO_INCREMENT,
     amountPaid INT NOT NULL,
     paymentStatus INT NOT NULL
    );
    `

    connection.query(connectionQuery, (err) => {
        if (err) {
            console.log('Error occured while creating tables', err.message)
            connection.end()
            return
        }
        console.log('Tables created')
    })
})


export default connection