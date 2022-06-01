const Student = require('../models/Student');
const Class = require('../models/Class');
const Subject = require('../models/Subject')
const getError = require("../utils/dbErrorHandle");
const generateStudentID = require("../utils/generateStudentID");

module.exports = {
    
    addStudent : async (req ,res) => {
        try {
            const {studentName,classId,fatherName,address,phoneNumber,password} = req.body;
            
            if (classId.length !== 12 && classId.length !== 24) {
                return res.status(400).json({
                    error : true,
                    message : "Class doesn't exist"
                })
            }
            
            const existingClass = await Class.findOne({_id : classId});
            
            if (existingClass === null) {
                return res.status(400).json({
                    error : true,
                    message : "Class doesn't exist"
                })
            } else {
                const stdNo = await generateStudentID(classId);

                const student = Student({
                    studentID : stdNo,
                    studentName : studentName,
                    class : classId,
                    fatherName : fatherName,
                    address : address,
                    phoneNumber : phoneNumber,
                    password : password,
                    pendingFees : existingClass.Fees_Per_Student,
                    Admin_Id:req.admin._id
                })
                
                await student.save();
                return res.status(200).json({
                    error : false,
                    message : "Student Created Successfully",
                    data : student
                });
            }

        } catch (error) {
            
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not create student."
            })

        }
    },
    getStudentProfile: async(req,res)=>{
        try{
            const student = req.student
            await student.populate('class');
            return res.status(200).json({
                error : false,
                data : student
            }); 
        }catch(error){
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Error Occurred."
            })
        }
    },
    loginStudent : async(req,res)=>{
        try {
            let username = (req.body.studentID).toLowerCase();
            const student = await Student.findByCredentials(username, req.body.password)
            if (student) {
                const token = await student.generateAuthToken()
                return res.status(200).json({
                    error : false,
                    data : student,
                    token: token
                })
            } else {
                return res.status(400).json({
                    error : true,
                    message : "username or password is wrong"
                })
            }
        } catch(error){
            return res.status(400).json({
                error: true,
                message:  "we can not able to login"
            })
        }
    },
    logoutStudent :async(req,res)=>{
        try {
            req.student.tokens = req.student.tokens.filter((token) => {
                return token.token !== req.token
            })
            await req.student.save()
            return res.status(200).json({
                error : false,
                message: "student is loggout successfully"
            })
        } catch(error){
            return res.status(400).json({
                error: true,
                message:  "we can not able to logout"
            })
        }
    },

    getStudentsByClass : async (req, res) => {
        try {
            //add year field in class model
            const { classId } = req.params;
            const students = await Student.find({ class : { _id : classId },Admin_Id:req.admin._id }).populate('class');
            return res.status(200).json({
                error : false,
                data : students
            }); 
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Error Occurred."
            })
        }
    },
    getStudentsByClassTeacher : async (req, res) => {
        try {
            //add year field in class model
            const { classId } = req.params;
            const students = await Student.find({ class : { _id : classId },Admin_Id:req.teacher.Admin_Id }).populate('class');
            return res.status(200).json({
                error : false,
                data : students
            }); 
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Error Occurred."
            })
        }
    },

    getStudentByStudentID : async (req,res) => {
        try {
            const {stdid} = req.params;
            // const student = await Student.findOne({studentID : stdid}).populate('class');
            const student = await Student.findOne({_id : stdid,Admin_Id:req.admin._id}).populate('class');
            if (student) {
                return res.status(200).json({
                    error : false,
                    message:"Student get successfully",
                    data : student
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
    getStudentByStudentIDwithUsername : async (req,res) => {
        try {
            const {stdid} = req.params;
            const student = await Student.findOne({studentID : stdid.toLowerCase(),Admin_Id:req.admin._id}).populate('class');
            // const student = await Student.findOne({_id : stdid}).populate('class');
            if (student) {
                return res.status(200).json({
                    error : false,
                    message:"Student get successfully",
                    data : student
                })
            } else {
                return res.status(200).json({
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

    updateStudent : async (req, res) => {
        try {
            const {id} = req.params;
            const student = await Student.findOne({_id : id,Admin_Id:req.admin._id});
            if(student){
                const updates = Object.keys(req.body)
                const allowedUpdates = ['studentName', 'fatherName', 'password', 'address', 'phoneNumber']
                const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
                if (!isValidOperation) {
                    return res.status(400).send({ error: 'Invalid updates!' })
                }
                updates.forEach((update) => student[update] = req.body[update])
                await student.save()
                return res.status(200).json({
                    error : false,
                    message : "Student updated successfully.",
                    data : student
                })
            }
            else{
                return res.status(400).json({
                    error : true,
                    message : "Student doesn't exist"
                })
            }

        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Student not updated."
            })
        }
    },
    // updateStudent : async (req, res) => {
    //     try {

    //         const {id} = req.params;
    //         const {studentName,fatherName,address,phoneNumber} = req.body;
    //         if (id.length !== 12 && id.length !== 24) {
    //             return res.status(400).json({
    //                 error : true,
    //                 message : "Student doesn't exist"
    //             })
    //         }
    //         const student = await Student.findOneAndUpdate({_id:id,Admin_Id:req.admin._id}, {
    //             studentName : studentName,
    //             fatherName : fatherName,
    //             address : address,
    //             phoneNumber : phoneNumber
    //         });

    //         return res.status(200).json({
    //             error : false,
    //             message : "Student updated successfully."
    //         })

    //     } catch (error) {
    //         let errMsg = getError(error)
    //         return res.status(400).json({
    //             error: true,
    //             message:  errMsg.length > 0 ? errMsg : "Student not updated."
    //         })
    //     }
    // },

    deleteStudent : async (req, res) => {
        try {
            const {id} = req.params;
            if (id.length !== 12 && id.length !== 24) {
                return res.status(400).json({
                    error : true,
                    message : "Student doesn't exist"
                })
            }
            const student = await Student.findOne({_id:id,Admin_Id:req.admin._id});
            if (student) {
                await Student.findByIdAndDelete(id);
                return res.status(200).json({
                    error : false,
                    message : "Student deleted successfully."
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
                message:  errMsg.length > 0 ? errMsg : "Student not deleted."
            })
        }
    },
    payFees : async (req, res) => {
        try {
            const {studentID,amount} = req.body;
            let studid = studentID.toLowerCase();
            const student = await Student.findOne({studentID : studid,Admin_Id:req.admin._id}).populate('class');
            if (student) {
                if (student.pendingFees - Math.abs(amount) < 0) {
                    return res.status(400).json({
                        error : true,
                        message : "Enter proper amount"
                    })
                } else {
                    let pendingFees = student.pendingFees - amount;
                    student.pendingFees = pendingFees;
                    await student.save();
                    return res.status(200).json({
                        error : false,
                        message : `Paid amount : ${amount}`,
                        data : student
                    })
                }
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
                message:  errMsg.length > 0 ? errMsg : "Student not deleted."
            })
        }
    },
    getAttendence : async (req, res) => {
        try {
            const classId = req.student.class;

            const subjects = await Subject.find({Class_Id : classId,Admin_Id:req.student.Admin_Id})  //fetch student.classId from localstorage
            const data = [];
            await subjects.map(async (subject) => {
                const total = req.student.attendence.length;
                let attended = 0;
                await req.student.attendence.map((lec)=>{
                    if(lec.present){
                        attended++;
                    }
                })
                data.push({
                    subjectName : subject.Subject_Name,
                    totalLecture : total,
                    attendedLecture : attended
                })
            });
                return res.status(200).json({
                    error : false,
                    data : data
                })

        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Student ."
            })
        }
    }
}