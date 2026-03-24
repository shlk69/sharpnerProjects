import express from 'express'
import studentsController from '../controller/studentsController.js'
const  router = express.Router()

router.post('/add',studentsController.addEntries)
router.put('/update/:id',studentsController.updateEntries)
router.delete('/delete/:id',studentsController.deleteEntries)
export default router