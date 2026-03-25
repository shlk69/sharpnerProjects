import connection from "../utils/db-connection.js";

const addUsers = (req, res) => {
    const { name, email } = req.body
    const insertionQue = `
    INSERT INTO users (name,email) VALUES (?,?)
    `
    connection.execute(insertionQue, [name, email], (err) => {
        if (err) {
            console.log(err.message)
            return res.status(500).send('Unble to create user')
        }
        console.log("User successfully created ! ")
        res.status(200).send(`User has been created with name ${name}`)
    })
}

const getAllUsers = (req, res) => {
    const getQuery = `
     SELECT * FROM users
    `
    connection.execute(getQuery, (err, results) => {
        if (err) {
            console.log(err.message)
            return res.status(500).send('Unable to fetch users !')
        }
        console.log('Fetched all users',results)
        res.status(200).send(results)
    })
}

export default {
    addUsers,
    getAllUsers
}