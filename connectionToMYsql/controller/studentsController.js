import Students from '../models/studentsModel.js'
import connection from '../utils/db-connection.js'


// POST /students → Insert a new student.
const addEntries = async (req, res) => {
    const { name, email } = req.body
    try {
        const student = await Students.create({
            "name": name,
            "email": email
        })
        console.log(`Student created with name ${student.name}`)
    } catch (error) {
        console.log('Error in adding student', error)
    }
}


// GET /students → Retrieve all students.
const getALlStudents = async (req, res) => {
    try {
        const allStudent = await Students.findAll()
        res.status(200).json(allStudent)
    } catch (error) {
        console.log('Error in fetching students', error)
        res.status(500).json({ error: 'Internal server error' })
    }
}

// GET /students/:id → Retrieve a student by ID.
const getStudentById = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await Students.findByPk(id)
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: 'Something broke!' });
    }
};



// PUT /students/:id → Update student details.
const updateEntries = async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    try {
        const student = await Students.findByPk(id)
        if (!student) {
            return res.status(404).json({ message: 'Student not found' }); 
        }
        student.name = name
        student.save()
        res.status(200).send(`User with name  has been updated`)
    } catch (error) {
       res.status(500).send('User cannot be updated')
    }
}


// DELETE /students/:id → Delete a student by ID.

const deleteEntries = async (req, res) => {
    const { id } = req.params
    try {
        const deletedStudent = await Students.findByPk(id)
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' }); 
        }
        await deletedStudent.destroy()
        res.status(200).send(`Student with name ${deletedStudent.name} is deleted`)
    } catch (error) {
        res.status(500).send('Unable to delete student')
    }
}

export default {
    addEntries,
    updateEntries,
    deleteEntries,
    getALlStudents,
    getStudentById
}