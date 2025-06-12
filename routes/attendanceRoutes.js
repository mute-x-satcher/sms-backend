const express = require('express')
const router = express.Router()
const {createAttendance,getAttendance,updateAttendance,deleteAttendance} = require('../controllers/attendanceController')
const {createAttendanceMiddleware} = require('../middleware/attendanceMiddleware')
const whatsappClientMiddleware = require('../middleware/whatsappClientMiddlware')

router.post('/get',getAttendance)
router.post('/create',whatsappClientMiddleware,createAttendanceMiddleware,createAttendance)
router.put('/update',whatsappClientMiddleware,updateAttendance)
router.delete('/delete',deleteAttendance)

module.exports = router