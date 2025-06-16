const getFormattedMessage = require('../whatsapp-web/formattedMessage')
const {getClient} = require('../whatsapp-web/client')
const studnetModel = require('../models/studentModel')
const formattedDate = require('../date_and_time/formatedDate')

const createStudent = async(req,res) => {

    try {
        
        const {studentName,rollNumber,classId,parentContacts} = req.body

        const {className}= req.classInfo

        const studentInfo = await studnetModel.create({
            studentName: studentName,
            rollNumber: rollNumber,
            className: className,
            classId: classId,
            parentContacts: parentContacts
        })

        res.status(200).json({msg: 'Student successfuly created ', studentInfo: studentInfo})

    } catch (error) {
        console.log(`studentController-createStudent Error: ${error}`)
    }

}

const getStudent = async(req,res) => {

       try {
        const {classId} = req.body

        console.log(req.body)

        if(!classId) return res.status(400).json({msg: 'Please provide a classId'})

        const allStudentInfo = await studnetModel.find({classId: classId})

       

        return res.status(200).json({msg: 'Student fetch successful' , allStudentInfo: allStudentInfo})
  
        } catch (error) {
            console.log(`studentController-getStudent Error: ${error}`)
        }

}

const updateStudent = async (req,res) => {

    try {
        
        const {studentName,rollNumber,parentContacts,studentId} = req.body

        const query = {}

        if(studentName) query.studentName = studentName
        if(rollNumber) query.rollNumber = rollNumber
        if(parentContacts) query.parentContacts = parentContacts

        const studentInfo = await studnetModel.updateOne({_id: studentId},{$set: query})
        console.log(studentInfo)
        if(studentInfo.matchedCount == 1) return res.status(200).json({msg: 'Student successfuly updated', studentInfo: studentInfo})



    } catch (error) {
        console.log(`studentController-updateStudent Error: ${error}`)
    }

}

const bunkReport = async (req,res) => {
        try {
            const {bunkList,groupId, lectureName} = req.body
            const date = formattedDate()
            const message = getFormattedMessage(date,bunkList,"Today's Bunk List",lectureName)
            const client = getClient()

             const msgResposne = await client.sendMessage(groupId,message)
           console.log(`Bunk report Message response:`,msgResposne) 

            return res.status(200).json({msg: 'Bunklist successfuly submitted'})

        } catch (error) {
            console.log(`studentController-bunkReport Error: ${error}`)
        }

}


const deleteStudent = async (req,res) => {

   try {
    
         const {studentId} = req.body

        if(!studentId) return res.status(400).json({msg: 'Please provide StudentId'})

        const studentInfo = await studnetModel.deleteOne({_id: studentId}) 

        if(studentInfo.deletedCount == 1){
         return res.status(200).json({msg: 'Delete opreation successfull'})
        }else{
        return res.status(400).json({msg: 'Delete opreation faild (Invaild studentId)'})
        }

   } catch (error) {
    console.log(`studentController-deleteStudent Error: ${error}`)
   }

}

module.exports = {createStudent,getStudent,updateStudent,bunkReport,deleteStudent}