const classModel = require('../models/classModel')
const userModel = require('../models/userModel')
const studentModel = require('../models/studentModel')
const attendanceModel = require('../models/attendanceModel')
const deletePDFById = require('../cloudinary/deleteFromCloudinary')

const createClass = async (req,res) => {
    
      try {
        
        const {className,standard,accountId} = req.body
        const {groupId,groupName} = req.groupInfo

        if(!className || !standard || !accountId){
        return res.status(400).json({msg: 'Please provide all fields'})
        }


        const verifyAccountId = await userModel.findOne({_id: accountId})

        if(!verifyAccountId){       
            return res.status(400).json({msg: 'Please provide a valid accountId'})
        }else{
       
        const classInfo = await classModel.create({
                className: className,
                standard: standard,
                groupName: groupName,
                groupId: groupId,
                accountId: accountId,
        })

            return res.status(200).json({msg: 'Class creation successful', classInfo: classInfo})

        }

      } catch (error) {
        console.log(`classController-createClass Error: ${error}`)
      }

}

const getClass = async (req,res) => {

    try {
        
        const {accountId} = req.body

        if(!accountId) res.status(400).json({msg: 'Please provide a accountId'})
        
        const allClassInfo = await classModel.find({accountId: accountId}) 

        return res.status(200).json({msg: 'Class fetch successful', allClassInfo: allClassInfo})

    } catch (error) {
        console.log(`classController-getClass Error: ${error}`)
    }

}

const updateClass = async (req,res) => {


    try {
        
        const {classId,className,standard} = req.body
      
        if(!classId) return res.status(400).json({msg: 'Please provide classId'})
    
        const {groupId,groupName} = req.groupInfo

        const query = {}
        
        if(className) query.className = className
        if(standard)  query.standard = standard
        if(groupId) query.groupId = groupId
        if(groupName) query.groupName = groupName

        const updatedClassInfo = await classModel.updateOne({_id: classId },{$set: query})
    
        if(updatedClassInfo.matchedCount == 1){
            query.classId = classId
            return res.status(200).json({msg: 'Class information updated successfuly' , query: query})
        }else{
            return res.status(400).json({msg: "Invaild classId",classId: classId})
        }

    } catch (error) {
        console.log(`classController-updateClass Error: ${error}`)
        return res.status(400).json({err_msg: 'Provide a vaild classId'})
    }
}

const deleteClass = async (req,res) => {
    
    try {
        
        const {classId} = req.body
        console.log(req.body)
        if(!classId) return res.status(400).json({msg: 'Please provide a classId'})

        // We are deleting all students associated with these class before deleting this classs

        const reportPDF = await attendanceModel.find({classId: classId})

        reportPDF.map((pdf) => {

        const url = pdf.pdfURL

            deletePDFById(url)
            .then((res) => console.log('deleted:',res))
            .catch((err) => console.log('err:',err))

        })

        await studentModel.deleteMany({classId: classId})

        await attendanceModel.deleteMany({classId: classId})

        const deletedClassInfo = await classModel.deleteOne({_id: classId})

        if(deletedClassInfo.deletedCount == 1){
            return res.status(200).json({msg: 'Delete opreation successfull', classId: classId})
        }else{
            return res.status(400).json({msg: 'Invaild classId',classId: classId})
        }

    } catch (error) {
        console.log(`classController-deleteClass Error: ${error}`)
    }

}

module.exports = {createClass,getClass,updateClass,deleteClass}