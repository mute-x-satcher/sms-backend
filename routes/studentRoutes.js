const express = require('express')
const router = express.Router()
const {createStudent,getStudent,updateStudent,bunkReport,deleteStudent} = require('../controllers/studentController')
const {createMiddleware,updateMiddleware} = require('../middleware/studentMiddleware')

router.post('/get',getStudent)
router.post('/create',createMiddleware,createStudent)
router.put('/update',updateMiddleware,updateStudent)
router.post('/bunk',bunkReport)
router.delete('/delete',deleteStudent)


module.exports = router