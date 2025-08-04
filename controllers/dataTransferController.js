const trasnX = async (req,res) => {
    const studentData = req.body;
    res.status(200).json({msg: 'Student Saved Successfuly'});
}

module.exports = trasnX