import express from 'express'
import courseController from '../controller/courseController.js'

const router = express.Router()


router.post('/addcourse', courseController.addCourses)
router.get('/addStudentCourses/:id',courseController.addStudentsToCourses)

export default router