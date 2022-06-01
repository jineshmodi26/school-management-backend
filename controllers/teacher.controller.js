const Teacher = require('../models/Teacher');
// const Class = require('../models/Class');
const Student = require('../models/Student')
const getError = require("../utils/dbErrorHandle");

async function generateUniqueUserName(proposedName) {
    return Teacher
        .findOne({ UserName: proposedName })
        .then(function (account) {
            if (account) {
                proposedName += Math.floor((Math.random() * 100) + 1);
                return generateUniqueUserName(proposedName); // <== return statement here
            }
            return proposedName.toLowerCase();
        })
        .catch(function (err) {
            console.error(err);
            throw err;
        });
}

module.exports = {
    
    addTeacher : async (req ,res) => {
        try {

            const {teacherName,Salary,Subjects_Id,password} = req.body;
                const userName = await generateUniqueUserName(teacherName);

                const teacher = Teacher({
                    studentID : userName,
                    Teacher_Name : teacherName,
                    UserName : userName,
                    Salary : Salary,
                    Subjects_Id : Subjects_Id,
                    password : password,
                    Admin_Id:req.admin._id
                })
                
                await teacher.save();
                
                return res.status(200).json({
                    error : false,
                    message : "Teacher Created Successfully",
                    data : teacher
                });

        } catch (error) {
            
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not create Teacher."
            })

        }
    },
    getTeachers :async(req,res)=>{
        try{
            const teachers = await Teacher.find({Admin_Id:req.admin._id}).populate({path : 'Subjects_Id.Subject_Id',
            populate : {
              path : 'Class_Id'
            }
        })
            return res.status(200).json({
                error : false,
                data : teachers
            }); 
        }catch(error){
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Error Occurred."
            })
        }
    },
    getTeacherProfile :async(req,res)=>{
        try{
            const teacher = req.teacher
            await teacher.populate(['Subjects_Id.Subject_Id']);
            return res.status(200).json({
                error : false,
                data : teacher
            }); 
        }catch(error){
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Error Occurred."
            })
        }
    },
    getTeacherByID : async (req, res) => {
        try {
            const {id} = req.params;
            const teacher = await Teacher.findOne({_id:id,Admin_Id:req.admin._id}).populate(['Subjects_Id.Subject_Id']);
            if (teacher) {
                return res.status(200).json({
                    error : false,
                    data : teacher
                })
            } else {
                return res.status(400).json({
                    error : true,
                    message : "Teacher doesn't exist."
                })
            }
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Error Occurred."
            })
        }
    },
    getTeacherByTeacherID : async (req,res) => {
        try {
            const {UserName} = req.body;
            const teacher = await Teacher.findOne({UserName : UserName}).populate(['Subjects_Id.Subject_Id']);
            if (teacher) {
                return res.status(200).json({
                    error : false,
                    data : teacher
                })
            } else {
                return res.status(400).json({
                    error : true,
                    message : "Student doesn't exist."
                })
            }
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Error Occurred."
            })
        }
    },
    loginTeacher : async(req,res)=>{
        try {
            let username = (req.body.UserName).toLowerCase();
            const teacher = await Teacher.findByCredentials(username, req.body.password)
            if (teacher) {
                const token = await teacher.generateAuthToken()
                return res.status(200).json({
                    error : false,
                    data : teacher,
                    token: token
                })
            } else {
                return res.status(400).json({
                    error : true,
                    message : "username or password is wrong"
                })
            }
        } catch (e) {
            res.status(400).send()
        }
    },
    logoutTeacher : async(req,res)=>{
        try {
            req.teacher.tokens = req.teacher.tokens.filter((token) => {
                return token.token !== req.token
            })
            await req.teacher.save()
            return res.status(200).json({
                error : false,
                message: "Teacher logout successfully"
            })
        } catch (e) {
            res.status(400).send()
        }
    },
    logoutTeacherAll : async(req,res)=>{
        try {
            req.teacher.tokens = []
            await req.teacher.save()
            return res.status(200).json({
                error : false,
                message: "Teacher logout successfully from all devices"
            })
        } catch (e) {
            res.status(400).send()
        }
    },

    updateTeacher : async (req, res) => {
        try {
            const {id} = req.params;
            const teacher = await Teacher.findOne({_id:id,Admin_Id:req.admin._id})
            if(teacher){
                const updates = Object.keys(req.body)
                const allowedUpdates = ['Teacher_Name', 'Salary', 'password', 'Subjects_Id']
                const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
                if (!isValidOperation) {
                    return res.status(400).send({ error: 'Invalid updates!' })
                }
                updates.forEach((update) => teacher[update] = req.body[update])
                await teacher.save()
                return res.status(200).json({
                    error : false,
                    message : "Teacher updated successfully.",
                    data : teacher
                })
            }
            else{
                return res.status(400).json({
                    error : true,
                    message : "Teacher doesn't exist"
                })
            }

        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Teacher not updated."
            })
        }
    },

    deleteTeacher : async (req, res) => {
        try {
            const {id} = req.params;
            if (id.length !== 12 && id.length !== 24) {
                return res.status(400).json({
                    error : true,
                    message : "Teacher doesn't exist"
                })
            }
            const teacher = await Teacher.findOneAndDelete({_id:id,Admin_Id:req.admin._id});
            if (teacher) {
                return res.status(200).json({
                    error : false,
                    message : "Teacher deleted successfully."
                })
            } else {
                return res.status(400).json({
                    error : true,
                    message : "teacher doesn't exist."
                })
            }
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "teacher not deleted."
            })
        }
    },

    postAttendence : async(req,res)=>{
        try {
            const {classId,subjectID,Attendence} = req.body
            const students = await Student.find({class:classId,Admin_Id:req.teacher.Admin_Id})
            if(!students){
                return res.status(400).json({
                    error: true,
                    message: "please enter valid class"
                })
            }
            else{
                students.map(async(student)=>{
                    let attnd = student.attendence;
                    const atobj = Attendence.find( O => O.studentId === student._id.toString())
                    const presen = atobj.present
                    attnd.push({subjectID:subjectID,present:presen});
                    await Student.findByIdAndUpdate(student._id,{
                        attendence: attnd
                    })
                })
                return res.status(200).json({
                    error:false,
                    message:"attendence is successfully submitted",
                    data: students
                })
            }
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "can not be able to post Attendence."
            })
            
        }
    }
}