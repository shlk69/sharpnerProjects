import connection from "../utils/db-connection.js";

const addBuses = (req, res) => {
    const {busNumber, totalSeats, availableSeats } = req.body
    const insertionQue = `
      INSERT INTO buses (busNumber , totalSeats , availableSeats)   VALUES(? , ? , ?)
    `  

    connection.execute(insertionQue, [busNumber, totalSeats, availableSeats], (err) => {
        if (err) {
            console.log(err.message)
            res.status(500).send(err.message)
            connection.end()      
        }
        console.log('Bus has  been added')
        res.status(200).send(`Bus created with number ${busNumber}`)
 })
}


const getBusByNum = (req, res) => {
    const { seats } = req.params
    const retriveQue = `
      SELECT * FROM buses WHERE availableSeats > ?
    `

    connection.execute(retriveQue, [seats], (err, results) => {
        if (err) {
            console.log(err.message)
            return res.status(500).send('Database error')
        }
        res.status(200).send("Got the buses", results)
        console.log(results)
    })
}


export default {
    addBuses,
    getBusByNum
}