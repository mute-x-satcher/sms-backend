const express = require('express')
const router = express.Router()
const {createStudent,getStudent,updateStudent,bunkReport,deleteStudent} = require('../controllers/studentController')
const studentMiddleware = require('../middleware/studentMiddleware')
const whatsappClientMiddleware = require('../middleware/whatsappClientMiddlware')

router.post('/get',getStudent)
router.post('/create',studentMiddleware,createStudent)
router.put('/update',studentMiddleware,updateStudent)
router.post('/bunk',whatsappClientMiddleware,bunkReport)
router.delete('/delete',deleteStudent)


module.exports = router