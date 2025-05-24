const getFormattedMessage = (date, studentList, heading) => {

  let message = `${date}\n${heading}\n\n`;

  studentList.forEach((student, index) => {
    message += `${student.studentName}\nRoll Number: ${student.rollNumber}`;
    message += `\n_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _\n`;
   
  });

  return message;
};



module.exports = getFormattedMessage