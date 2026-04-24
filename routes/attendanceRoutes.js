const express = require('express')
const router = express.Router()
const {createAttendance,getAttendance,updateAttendance,bunkReport,attendanceAnalytics,deleteAttendance} = require('../controllers/attendanceController')
const {createAttendanceMiddleware} = require('../middleware/attendanceMiddleware')
const whatsappClientMiddleware = require('../middleware/whatsappClientMiddlware')

router.post('/get',getAttendance)
router.post('/create',createAttendanceMiddleware,createAttendance)
router.put('/update',updateAttendance)
router.post('/bunk',,bunkReport)
router.post('/analytics',attendanceAnalytics)
// router.post('/pdf',generatePDF)
router.delete('/delete',deleteAttendance)

module.exports = router
