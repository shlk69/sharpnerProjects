import express from 'express'
import mysql from 'mysql2'

const app = express()


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Shl.SQL69',
    database: 'testdb',
    multipleStatements:true
})

connection.connect((err) => {
    if (err) {
        console.log('Error occured : ',err.message)
        return
    }
    console.log('Connection is created')
    const connectionQuery = `create table Users(
     id INT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(20),
     email VARCHAR(20)
    );

    CREATE TABLE Buses (
     id INT PRIMARY KEY AUTO_INCREMENT,
     busNumber INT,
     totalSeats INT,
     availableSeats INT
);

    create table Bookings(
     id INT PRIMARY KEY AUTO_INCREMENT,
     seatNumber INT NOT NULL
    );
     
    create table Payments(
     id INT PRIMARY KEY AUTO_INCREMENT,
     amountPaid INT NOT NULL,
     paymentStatus INT NOT NULL
    );
    `

    connection.query(connectionQuery,(err) => {
        if (err) {
            console.log('Error occured while creating tables', err.message)
            connection.end()
            return
        }
        console.log('Tables created')
    })
})


app.get('/', (req, res) => {
    res.send("Bus booking system is online !")
})

app.listen(3000, () => {
    console.log('server is running on http://localhost:3000');
})