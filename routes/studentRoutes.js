const express = require('express')
const router = express.Router()
const {createStudent,getStudent,updateStudent,bunkReport,deleteStudent} = require('../controllers/studentController')
const {createMiddleware,updateMiddleware} = require('../middleware/studentMiddleware')
const whatsappClientMiddleware = require('../middleware/whatsappClientMiddlware')

router.post('/get',getStudent)
router.post('/create',createMiddleware,createStudent)
router.put('/update',updateMiddleware,updateStudent)
router.post('/bunk',whatsappClientMiddleware,bunkReport)
router.delete('/delete',deleteStudent)


module.exports = router