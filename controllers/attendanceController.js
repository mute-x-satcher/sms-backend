const attendanceModel = require('../models/attendanceModel')
const generatePDFBuffer = require('../pdf/generatePDF');
const uploadPDF = require('../cloudinary/uploadToCloudinary');
const deletePDFByUrl = require('../cloudinary/deleteFromCloudinary')
const formattedDate = require('../date_and_time/formatedDate')
const formatedMessage = require('../whatsapp-web/formattedMessage')
const { getClient } = require('../whatsapp-web/client');
const studnetModel = require('../models/studentModel');


const createAttendance = async (req, res) => {

    try {
        const { classId, groupId, className, reportType, reportName, attendance } = req.body
        // console.log(req.body)
        const reportDate = formattedDate()
    
        // const pdfData = {
        //     className,
        //     reportDate,
        //     reportName,
        //     attendance,
        // }

        // const buffer = await generatePDFBuffer(pdfData);
        // const filename = `${pdfData.className.replace(/\s+/g, '_')}_${reportDate.replace(/[\s,]+/g, '_')}.pdf`;
        // const url = await uploadPDF(buffer, filename);
        // console.log('Uploaded to Cloudinary:', url);
      
        
        // attendance.forEach((student) => {
        //     delete student.studentName
        //     delete student.rollNumber
        // })

      
        const attendanceInfo = await attendanceModel.create({
            classId: classId,
            reportDate: reportDate,
            reportType: reportType,
            reportName: reportName,
            attendance: attendance,
         
        })

        const reportId = attendanceInfo._id

        const populatedAttendance = await attendanceModel.findOne({ _id: reportId }).populate({
            path: 'attendance.studentId',
            select: 'studentName rollNumber _id'
        }).lean()
        // console.log(populatedAttendance.attendance)

        const flattened = populatedAttendance.attendance.map(entry => ({
            ...entry.studentId,
            status: entry.status
        }))

        populatedAttendance.attendance = flattened
        const studentAttendance = populatedAttendance.attendance
        // console.log(populatedAttendance.attendance)

        let absnetStudents = []

        studentAttendance.map((student) => {
            if (student.status == 'absent') {
                absnetStudents.push({
                    studentName: student.studentName,
                    rollNumber: student.rollNumber,
                    id: student._id
                })
            }
        })

        
        absnetStudents.map(async (student) => {
            await studnetModel.updateOne({ _id: student.id }, { $inc: { absentCount: 1 } })
        })
        
        
        
        
        if (absnetStudents.length > 0) {
            const message = formatedMessage(reportDate, absnetStudents, "Today's Absent Students")
            const client = getClient()
            const msgResposne = await client.sendMessage(groupId, message)
            //    console.log(`Attendacne create Message response:`,msgResposne) 
        }


        return res.status(200).json({ msg: 'Attendance report successfuly created', attendanceReport: populatedAttendance })

    } catch (error) {
        console.log(`attendanceController-createAttendance Error: ${error}`, error)
        return res.status(400).json({ err_msg: 'Faild to create Attendance report', error: error })
    }

}

const getAttendance = async (req, res) => {

    const { classId } = req.body

    if (!classId) return res.status(400).json({ msg: 'Please provide a classId' })

    const allAttendanceInfo = await attendanceModel.find({ classId }).populate({
        path: 'attendance.studentId',
        select: 'studentName rollNumber _id'
    }).lean()


    allAttendanceInfo.map(populatedAttendance => {
        const flattened = populatedAttendance.attendance.map(entry => ({
            ...entry.studentId,
            status: entry.status
        }))
        populatedAttendance.attendance = flattened
        // console.log(populatedAttendance.attendance)
    })



    return res.status(200).json({ msg: 'Attendance report fetch successful', allAttendanceInfo: allAttendanceInfo })
}

const updateAttendance = async (req, res) => {


    try {

        const { updatedAttendance, className, reportName, reportType, reportId, groupId } = req.body

        const rawAttendance = await attendanceModel.findOne({ _id: reportId })
        const populatedAttendance = await attendanceModel.findOne({ _id: reportId }).populate({
            path: 'attendance.studentId',
            select: 'studentName rollNumber _id'
        }).lean()
        // console.log(populatedAttendance.attendance)

        const flattened = populatedAttendance.attendance.map(entry => ({
            ...entry.studentId,
            status: entry.status
        }))
        populatedAttendance.attendance = flattened
        const studentAttendance = populatedAttendance.attendance

        // const buffer = await generatePDFBuffer(populatedAttendance);
        // const filename = `${className.replace(/\s+/g, '_')}_${populatedAttendance.reportDate.replace(/[\s,]+/g, '_')}.pdf`;
        // const url = await uploadPDF(buffer, filename);
        // console.log('Uploaded to Cloudinary(update route):', url);

        const studentsToIncrement = []
        const studentsToDecrement = []

        for (const student of studentAttendance) {

            for (const updatedStudent of updatedAttendance) {

                if (student.rollNumber === updatedStudent.rollNumber) {

                    if (student.status == 'present' && updatedStudent.status == 'absent') {
                        studentsToIncrement.push(student)
                    }else if(student.status == 'leave' && updatedStudent.status == 'absent'){
                        studentsToIncrement.push(student)
                    }else if(student.status == 'absent' && updatedStudent.status == 'leave'){
                        studentsToDecrement.push(student)
                    }
                     else if (student.status == 'absent' && updatedStudent.status == 'present') {
                        studentsToDecrement.push(student)
                    }

                    student.studentName = updatedStudent.studentName
                    student.status = updatedStudent.status

                }
            }
        }

        console.log('Increment Students:', studentsToIncrement)
        console.log('Decrement Students:', studentsToDecrement)

        studentsToIncrement.map(async (student) => {
            await studnetModel.updateOne(
                { _id: student._id.toString() },
                { $inc: { absentCount: 1 } }
            )
        })

        studentsToDecrement.map(async (student) => {
            await studnetModel.updateOne(
                { _id: student._id.toString(), absentCount: { $gt: 0 } },
                { $inc: { absentCount: -1 } }
            )

        })


        for (const student of rawAttendance.attendance) {

            for (const updatedStudent of updatedAttendance) {
                if (student.studentId.toString() == updatedStudent.studentId)
                    student.status = updatedStudent.status
            }

        }
      
        const query = {}

        if (rawAttendance.attendance) query.attendance = rawAttendance.attendance
        if (reportName) query.reportName = reportName
        if (reportType) query.reportType = reportType
       

        const reportInfo = await attendanceModel.updateOne({ _id: reportId }, { $set: query })


        const reportDate = formattedDate()
        if (reportDate == populatedAttendance.reportDate) {

            let absnetStudents = []

            studentAttendance.map((student) => {
                if (student.status == 'absent') {
                    absnetStudents.push({
                        studentName: student.studentName,
                        rollNumber: student.rollNumber
                    })
                }
            })


            if (absnetStudents.length > 0) {
                const message = formatedMessage(reportDate, absnetStudents, "Today's Absent Students(Updated)")
                const client = getClient()
                const msgResposne = await client.sendMessage(groupId, message)
                //    console.log(`Attendacne update Message response:`,msgResposne) 
            }
        }


        if (reportInfo.matchedCount > 0) return res.status(200).json({ msg: 'Attendance report updated successfuly', updatedReport: populatedAttendance },)


    } catch (error) {
        console.log(`attendanceController-updateAttendance Error: ${error}`, error)
    }

}

const bunkReport = async (req, res) => {
    try {
        const { bunkList, groupId,classId,lectureName } = req.body
        const date = formattedDate()
        const message = formatedMessage(date, bunkList, "Today's Bunk List", lectureName)
        const client = getClient()

        console.log(req.body)
        // console.log(bunkList)

        console.log(date)

        // const reportExist = await attendanceModel.findOne({classId: classId , reportDate: {$regex: date}})

        // console.log(reportExist)

        // if(!reportExist) return res.status(409).json({msg: "Mark today's attendance before generating the bunk report"})

            // bunkList.map(async (student) => {
            //  await attendanceModel.updateOne(
            //         {
            //             classId: classId,reportDate: date, "attendance.studentId": student.studentId
            //         },
            //         { $set: { "attendance.$.status": 'absent' } })
            
            //     })

            

            bunkList.map(async (student) => {
                await studnetModel.updateOne(
                    { _id: student.studentId },
                    { $inc: { bunkCount: 1 } }
                )
            })
        // await attendanceModel.updateOne

        const msgResposne = await client.sendMessage(groupId, message)
        //    console.log(`Bunk report Message response:`,msgResposne) 

        return res.status(200).json({ msg: 'Bunklist successfuly submitted' })

    } catch (error) {
        console.log(`studentController-bunkReport Error: ${error}`)
    }

}

const generatePDF = async (req,res) => {
    
    try {
        
    const {report,className} = req.body
    report.className = className    
    const buffer = await generatePDFBuffer(report)

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=AttendanceReport.pdf');
    res.send(buffer);
        
    } catch (error) {
        console.log(`attendnaceController-generatePDF Error: ${error}`)        
    }
   
}


const deleteAttendance = async (req, res) => {

    try {

        const { reportId } = req.body

        const populatedReportPDF = await attendanceModel.findOne({ _id: reportId }).populate({
            path: 'attendance.studentId',
            select: '_id status'
        }).lean()

        const flattened = populatedReportPDF.attendance.map(entry => ({
            ...entry.studentId,
            status: entry.status

        }))

        const studentsToDecrement = []
        flattened.map((student) => {
            if (student.status == 'absent') studentsToDecrement.push(student)
        })

        studentsToDecrement.map(async (student) => {
            await studnetModel.updateOne(
                { _id: student._id.toString(), absentCount: { $gt: 0 } },
                { $inc: { absentCount: -1 } }
            )
        })

        const url = populatedReportPDF.pdfURL
        deletePDFByUrl(url)
        .then((res) => console.log(`Deleted:`,res))
        .catch((err) => console.log('Error:', err))

        const reportInfo = await attendanceModel.deleteOne({ _id: reportId })

        if (reportInfo.deletedCount == 1) return res.status(200).json({ msg: 'Attendance report deleted successfuly', reportId: reportId })

    } catch (error) {
        console.log(`attendanceController-deleteAttendance Error: ${error}`)
    }
}



module.exports = { createAttendance, updateAttendance, getAttendance, bunkReport, generatePDF,deleteAttendance }