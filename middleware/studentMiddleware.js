const studentModel = require('../models/studentModel')
const classModel = require('../models/classModel')

const createMiddleware = async (req,res,next) => {

    try {
        
        const {studentName,rollNumber,classId,parentContacts} = req.body

        // We are using a optinal chaining to avoid eror of .length
        if(!studentName || !rollNumber || !classId || parentContacts?.length === 0){
            return res.status(400).json({msg: 'Please provide all fields'})
        }

        const classExist = await classModel.findOne({_id: classId})

        if(!classExist) return res.status(400).json({msg: 'Invaild classId',classId: classId})

        const className = classExist.className

        req.classInfo = {className}

        // console.log(parentContacts.length)
        if(parentContacts[1]){
            for(const number of parentContacts){
                if(number.length != 10) return res.status(400).json({msg: 'Please provide a valid phone number'})
            }
        }else{
            if(parentContacts[0].length != 10) {
                return res.status(400).json({msg: 'Please provide a valid phone number'})
            }
        }
          
        

        const studentExists = await studentModel.findOne({$and:[{rollNumber: rollNumber},{classId: classId}]})

        if(studentExists) return res.status(409).json({msg: 'Student with this Roll Number already exists',rollNumber: rollNumber})
        
        
        
        next()
    } catch (error) {
        console.log(`studentMiddleware-createMiddleware Error: ${error}`)
        return res.status(402).json({msg:'Please provide valid classId'})
    }
}

const updateMiddleware = async (req,res,next) =>{

    try {

        const {rollNumber,parentContacts,classId} = req.body
   
        if(parentContacts[1]){
            for(const number of parentContacts){
                if(number.length != 10) return res.status(400).json({msg: 'Please provide a valid phone number'})
            }
        }else{
            if(parentContacts[0].length != 10) {
                return res.status(400).json({msg: 'Please provide a valid phone number'})
            }
        }
          

            if(rollNumber){
             const studentExists = await studentModel.findOne({$and:[{rollNumber: rollNumber},{classId: classId}]})
             if(studentExists) return res.status(409).json({msg: 'Student with this rollNumber already exist', rollNumber: rollNumber})
            }

            next()

    } catch (error) {
        console.log(`studentMiddleware-updateMiddleware Error: ${error}`)
    }




}


module.exports = {createMiddleware,updateMiddleware}