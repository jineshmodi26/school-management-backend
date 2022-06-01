const Student = require('../models/Student');
const Class = require("../models/Class");
const SchoolAdmin = require("../models/SchoolAdmin")
// const { parse } = require('dotenv');
// const { compareSync } = require('bcrypt');

module.exports = async (classId) => {
    const classe = await Class.findOne({_id : classId})
    const admin = await SchoolAdmin.findById(classe.Admin_Id);
    const schoolName = (admin.SchoolName).split(' ')[0];
    
    const stdData = (classe.Std_Name.split("__")[1]).split("_");
    // const stdData = classe.Std_Name.split("_");
    const stdClass = parseInt(stdData[0]);
    const stdDivison = stdData[1];
    // const students = await Student.find({ class : { _id : classId } });
    const student = await Student.find({ class : { _id : classId } }).sort('-studentID').limit(1); //new
    const admissionYear = parseInt(new Date().getFullYear().toString())- 2000 - stdClass;
    if (student.length == 0) {
        return (schoolName+"__"+admissionYear+stdDivison+(student.length+1)).toLowerCase();
    } else {
        let remov = schoolName.length+5;
        let lastNumber = student[0].studentID.slice(remov); //new
        return (schoolName+"__"+admissionYear+stdDivison+(parseInt(lastNumber)+1)).toLowerCase(); //new
    }
}

// const Student = require('../models/Student');
// const Class = require("../models/Class");
// // const { parse } = require('dotenv');
// // const { compareSync } = require('bcrypt');

// module.exports = async (classId) => {
//     const classe = await Class.findById(classId)
//     const stdData = classe.Std_Name.split("_");
//     const stdClass = parseInt(stdData[0]);
//     const stdDivison = stdData[1];
//     const students = await Student.find({ class : { _id : classId } });
//     const totalStudentsInClass = students.length;
//     const admissionYear = parseInt(new Date().getFullYear().toString())- 2000 - stdClass;
//     // const admissionYear = new Date().getFullYear() - 2000 - stdClass;
//     return admissionYear+stdDivison+(totalStudentsInClass+1);
// }