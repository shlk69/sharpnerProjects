import connection from '../utils/db-connection.js'

const addEntries = (req, res) => {
    const { name, email } = req.body
    const insertQue = 'INSERT INTO  students (email,name)  VALUES(?,?)';

    connection.execute(insertQue, [email, name], (err) => {
        if (err) {
            console.log(err.message)
            res.status(500).send(err.message)
            connection.end()
            return
        }

        console.log('Value has been inserted')
        res.status(200).send(`Student with name ${name} successfully created`)
    })
}

const updateEntries = (req, res) => {
    const { id } = req.params
    const { name } = req.body
    const updateQue = `UPDATE students set name = ? WHERE id=?`;

    connection.execute(updateQue, [name, id], (err, result) => {
        if (err) {
            console.log(err.message)
            res.status(500).send(err.message)
            connection.end()
            return
        }

        if (result.affectedRows === 0) {
            res.status(404).send('Student not found')
            return
        }

        res.status(200).send('User has been updated')
    })
}


const deleteEntries = (req, res) => {
    const { id } = req.params
    const deleteQue = `DELETE FROM students WHERE id = ?`;

    connection.execute(deleteQue, [id], (err, result) => {
        if (err) {
            console.log(err.message)
            res.status(500).send(err.message)
            connection.end()
            return
        }

        if (result.affectedRows === 0) {
            res.status(404).send('Studenr is not found')
            return
        }

        res.status(200).send(`User with id ${id} is deleted`)
    })
}

export default  {
    addEntries,
    updateEntries,
    deleteEntries
}