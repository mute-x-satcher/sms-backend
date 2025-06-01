const express = require('express')
const router = express.Router()
const {createAttendance,getAttendance,updateAttendance,deleteAttendance} = require('../controllers/attendanceController')
const {createAttendanceMiddleware} = require('../middleware/attendanceMiddleware')

router.post('/get',getAttendance)
router.post('/create',createAttendanceMiddleware,createAttendance)
router.put('/update',updateAttendance)
router.delete('/delete',deleteAttendance)

module.exports = router