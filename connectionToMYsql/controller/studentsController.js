import connection from '../utils/db-connection.js'


// POST /students → Insert a new student.
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


// GET /students → Retrieve all students.
const getALlStudents = (req, res) => {
    const gettingQue = `
      SELECT * FROM students
    `
    connection.execute(gettingQue, (err, results) => {
        if (err) {
            console.log(err.message)
            return res.status(500).send(`Can't get students due to : ${err.message}`)
        }
        console.log('These are all students :- ', results)
        res.status(200).send('Fetched all students',results)
    })
}

// GET /students/:id → Retrieve a student by ID.
const getALlStudentById = (req, res) => {
    const { id } = req.params
    const getById = `
      SELECT * FROM students WHERE id = ?
    `
    connection.execute(getById, [id], (err,results) => {
        if (err) {
            console.log(err.message)
            return res.status(500).send(`Unable to fetch student with id ${id} due to ${err.message}`)
        }
        if (results.length == 0) {
            return res.status(404).send(`Student with id ${id} not found`)
        }
        const student = results[0];
        console.log(student)
        res.status(200).json({
            message: `Found student with id ${id}`,
            data: student
        });
    })
}


// PUT /students/:id → Update student details.
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


// DELETE /students/:id → Delete a student by ID.

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
    deleteEntries,
    getALlStudents,
    getALlStudentById
}