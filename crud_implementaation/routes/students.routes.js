const express = require('express')
const router = express.Router()

const students = [

    { id: 1, name: "Alice" },

    { id: 2, name: "Bob" },

    { id: 3, name: "Charlie" }

]

router.get('/', (req, res) => {
    let Students = ""
    for (let i = 0; i < students.length; i++) {
        Students += students[i].name + ","
    }
    res.send(`Here is the list of students :  ${Students}`)
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    let studentById = ""
    for (let i = 0; i < students.length; i++){
        if (students[i].id == id) {
            studentById += students[i].name
            break
        }
    }
    if (!studentById.length) {
        res.send("Student not found")
        return
    }
    res.send(`The student with ${id} is ${studentById}`)
})


module.exports = router