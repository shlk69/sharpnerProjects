const express = require('express');
const { route } = require('./students.routes');
const router = express.Router()

const courses = [

    { id: 1, name: "Frontend", description: "HTML, CSS, JS, React" },

    { id: 2, name: "Backend", description: "Node.js, Express, MongoDB" }

];

router.get('/', (req, res) => {
    let Courses = ""
    for (let i = 0; i < courses.length;i++) {
        Courses += courses[i].name + ","
    }
    res.send(`Courses: ${Courses}`)
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    let courseById = ""
    for (let i = 0; i < courses.length;i++) {
        if (id == courses[i].id) {
            courseById += `Course: ${courses[i].name} , Description: ${courses[i].description}`
            break;
        }
    }
    if (!courseById) {
        res.send("Course not found")
        return
    }
    res.send(courseById)
   
})


module.exports = router