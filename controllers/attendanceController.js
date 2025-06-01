const attendanceModel = require('../models/attendanceModel')
const generatePDFBuffer = require('../pdf/generatePDF');
const uploadPDF = require('../cloudinary/uploadToCloudinary');
const deletePDFByUrl = require('../cloudinary/deleteFromCloudinary')
const formattedDate = require('../date_and_time/formatedDate')
const formatedMessage = require('../whatsapp-web/formattedMessage')
const getClient = require('../whatsapp-web/client')


const createAttendance = async (req,res) => {

    try {
        const {classId,groupId,className,reportType,reportName,attendance} = req.body    
        console.log(req.body)
        const reportDate = formattedDate()
        const data = req.body
        data.reportDate = reportDate

        const buffer = await generatePDFBuffer(data);
        const filename = `${data.className.replace(/\s+/g, '_')}_${reportDate.replace(/[\s,]+/g, '_')}.pdf`;
        const url = await uploadPDF(buffer, filename);
        console.log('Uploaded to Cloudinary:', url);


    const attendanceInfo = await attendanceModel.create({
            classId: classId,
            reportDate: reportDate,
            reportType: reportType,
            reportName: reportName,
            pdfURL: url,
            attendance: attendance

    })

     let absnetStudents = []

     attendance.map((student) => {
        if(student.status == 'absent')
        {
            absnetStudents.push({
                studentName: student.studentName,
                rollNumber: student.rollNumber
            })
        }
     })

     const message = formatedMessage(reportDate,absnetStudents,"Today's Absent Students")

     if(absnetStudents.length > 0){
         const client = getClient()
         await client.sendMessage(groupId,message)
    }


    return res.status(200).json({msg: 'Attendance report successfuly created', attendanceReport: attendanceInfo, pdfURL: url})

    } catch (error) {
        console.log(`attendanceController-createAttendance Error: ${error}`,error)   
        return res.status(400).json({err_msg: 'Faild to create Attendance report', error: error })     
    }

}

const getAttendance = async (req,res) => {

      const {classId} = req.body

      if(!classId) return res.status(400).json({msg: 'Please provide a classId'})
        
      const allAttendanceInfo  = await attendanceModel.find({classId})

      return res.status(200).json({msg: 'Attendance report fetch successful' , allAttendanceInfo: allAttendanceInfo})
}

const updateAttendance = async (req,res) => {


        try {
        
        const {updatedAttendance,className,reportName,reportType,reportId,groupId} = req.body

        const attendanceReport = await attendanceModel.findOne({_id: reportId})

        const {attendance} = attendanceReport

        for(const student of attendance){
            
            for(const updatedStudent of updatedAttendance){

                if(student.rollNumber === updatedStudent.rollNumber)
                {
                    student.studentName = updatedStudent.studentName
                    student.status = updatedStudent.status
                }

            }

        }

        const buffer = await generatePDFBuffer(attendanceReport);
        const filename = `${className.replace(/\s+/g, '_')}_${attendanceReport.reportDate.replace(/[\s,]+/g, '_')}.pdf`;
        const url = await uploadPDF(buffer, filename);
        console.log('Uploaded to Cloudinary(update route):', url);

        const query = {}

        if(attendance) query.attendance = attendance
        if(reportName) query.reportName = reportName 
        if(reportType) query.reportType = reportType   


        const reportInfo = await attendanceModel.updateOne({_id: reportId},{$set: query})

    
        const reportDate = formattedDate()
    if(reportDate == attendanceReport.reportDate){

        let absnetStudents = []
    
         attendance.map((student) => {
            if(student.status == 'absent')
            {
                absnetStudents.push({
                    studentName: student.studentName,
                    rollNumber: student.rollNumber
                })
            }
         })
    

        if(absnetStudents.length > 0){ 
           const message = formatedMessage(reportDate,absnetStudents,"Today's Absent Students(Updated)")
           const client = getClient()
           await client.sendMessage(groupId,message)
        }
    }


        if(reportInfo.matchedCount > 0) return res.status(200).json({msg: 'Attendance report updated successfuly', query: query ,pdfURL: url}, )

                
        } catch (error) {
            console.log(`attendanceController-updateAttendance Error: ${error}`,error)
        }

}


const deleteAttendance = async(req,res) => {

      try {
        
        const {reportId} = req.body

        const reportPDF = await attendanceModel.findOne({_id: reportId})

        const url = reportPDF.pdfURL


        deletePDFByUrl(url)
        .then((res) => console.log(`Deleted:`,res))
        .catch((err) => console.log('Error:', err))

        const reportInfo = await attendanceModel.deleteOne({_id: reportId})
        
        if(reportInfo.deletedCount == 1) return res.status(200).json({msg:'Attendance report deleted successfuly',reportId: reportId})

      } catch (error) {
        console.log(`attendanceController-deleteAttendance Error: ${error}`)
      }
}



module.exports = {createAttendance,updateAttendance,getAttendance,deleteAttendance}