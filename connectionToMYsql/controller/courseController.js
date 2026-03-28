import Course from "../models/courses.js"
import Students from "../models/studentsModel.js"




const addCourses = async (req, res) => {
    try {
        const { courseName } = req.body
        const course = await Course.create({
            "courseName":courseName
        })
        res.json(course)  
    } catch (error) {
      res.status(500).json({error:error.message})   
    }
}


const addStudentsToCourses = async (req, res) => {
    try {
        const { studentId, courseIds } = req.body
        const { id } = req.params
        const student = await Students.findByPk(studentId)
        const course = await Course.findAll({
            where: {
                id:courseIds
            }
        })

        await student.addCourses(course)
        const uodatedStudent = await Students.findByPk(studentId, { include: Course })
        res.status(200).json(uodatedStudent)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}


export default {addCourses,addStudentsToCourses}