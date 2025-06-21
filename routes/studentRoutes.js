const express = require('express')
const router = express.Router()
const {createStudent,getStudent,updateStudent,deleteStudent} = require('../controllers/studentController')
const studentMiddleware = require('../middleware/studentMiddleware')

router.post('/get',getStudent)
router.post('/create',studentMiddleware,createStudent)
router.put('/update',studentMiddleware,updateStudent)
router.delete('/delete',deleteStudent)


module.exports = router