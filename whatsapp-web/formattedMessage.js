const getFormattedMessage = (date, studentList, heading , lecture) => {

  let message
  if(!lecture){
     message = `${date}\n${heading}\n\n`;
  }else{
     message = `${date}\n${heading}\nBuncked lecture: ${lecture}\n\n`;
  }

  studentList.forEach((student, index) => {
    message += `${student.studentName}\nRoll Number: ${student.rollNumber}`;
    message += `\n_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _\n`;
   
  });

  return message;
};



module.exports = getFormattedMessage