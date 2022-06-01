const Exam = require("../models/Exam");
const Teacher = require('../models/Teacher')
const Class = require('../models/Class')
const Subject = require('../models/Subject')
const getError = require("../utils/dbErrorHandle");
const mongoose = require('mongoose')

module.exports = {

    addExamTeacher : async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const { classId, startDate, endDate, exams} = req.body;
            let sd = new Date(startDate);
            let ed = new Date(endDate);
            if (sd.getTime() > ed.getTime()) {
                return res.status(400).json({
                    error : true,
                    message : "Please enter proper dates."
                })
            }

            const exam = Exam({
                teacher : teacherId,
                class : classId,
                startDate : startDate,
                endDate : endDate,
                exams : exams,
                Admin_Id:req.teacher.Admin_Id
            });
            await exam.save();
            await exam.populate({ path: 'class', select: '_id Std_Name' }).populate({ path: 'exams.subject', select : '_id Subject_Name'});
            return res.status(200).json({
                error : false,
                message : "Exam scheduled.",
                exam : exam
            })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not schedule exam."
            })
        }
    },
    addExamAdmin : async (req, res) => {
        try {
            const { classId, startDate, endDate, exams} = req.body;
            let sd = new Date(startDate);
            let ed = new Date(endDate);
            if (sd.getTime() > ed.getTime()) {
                return res.status(400).json({
                    error : true,
                    message : "Please enter proper dates."
                })
            }

            const exam = Exam({
                teacher : req.admin._id,
                class : classId,
                startDate : startDate,
                endDate : endDate,
                exams : exams,
                Admin_Id:req.admin._id
            });
            await exam.save();
            return res.status(200).json({
                error : false,
                message : "Exam scheduled."
            })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not schedule exam."
            })
        }
    },
    getExamByIdAdmin: async (req, res) => {
        try {
            const {id} = req.params;
            const exam = await Exam.findOne({_id:id,Admin_Id:req.admin._id}).populate([{path:'exams.subject',
            populate:{
                path:'Class_Id'
            }
        },{
            path:'teacher'
        },{
            path:'class'
        }]);
            // const exam = await Exam.findById(id).populate(['teacher', 'class','exams.subject']);
            return res.status(200).json({
                error: false,
                data: exam
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not get exams."
            })
        }
    },
    getExamByIdStudent: async (req, res) => {
        try {
            const {id} = req.params;
            const exam = await Exam.findOne({_id:id,Admin_Id:req.student.Admin_Id}).populate([{path:'exams.subject',
            populate:{
                path:'Class_Id'
            }
        },{
            path:'teacher'
        },{
            path:'class'
        }]);
            // const exam = await Exam.findById(id).populate(['teacher', 'class','exams.subject']);
            return res.status(200).json({
                error: false,
                data: exam
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not get exams."
            })
        }
    },
    getExamByIdTeacher: async (req, res) => {
        try {
            const {id} = req.params;
            const exam = await Exam.findOne({_id:id,Admin_Id:req.teacher.Admin_Id}).populate([{path:'exams.subject',
            populate:{
                path:'Class_Id'
            }
        },{
            path:'teacher'
        },{
            path:'class'
        }]);
            // const exam = await Exam.findById(id).populate(['teacher', 'class','exams.subject']);
            return res.status(200).json({
                error: false,
                data: exam
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not get exams."
            })
        }
    },
    getAllExamsAdmin: async(req,res)=>{
        try {
            const exams = await Exam.find({Admin_Id:req.admin._id}).populate(['teacher', 'class','exams.subject']);
            if(exams){
                return res.status(200).json({
                    error: false,
                    message : "done",
                    exams: exams
                })
            }
        } catch (error) {
            let errMsg = getError(error)
                    return res.status(400).json({
                        error: true,
                        message: errMsg.length > 0 ? errMsg : "Could not get exams."
                    })
        }
        
    },

    getAllExamsNew : async (req, res) => {
        try {
            const exams = await Exam.find({Admin_Id:req.admin._id}).populate({ path: 'class', select: '_id Std_Name' }).populate({ path: 'exams.subject', select : '_id Subject_Name'});
            return res.status(200).json({
                error : false,
                data : exams
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not get exams."
            })
        }
    },

    getAllExams: async (req, res) => {
        try {
            const exams = await Exam.find({Admin_Id:req.admin._id});
            const finalResult = [];
            exams.map(async (item, index) => {
                // const teacher = await Teacher.findById(item.teacher);
                const teacher = await Teacher.findOne({_id:item.teacher,Admin_Id:req.admin._id})
                const classes = await Class.findOne({_id:item.class,Admin_Id:req.admin._id})
                const sub = [];
                item.exams.map(async (data, inx) => {
                    const subject = await Subject.findOne({_id:data.subject,Admin_Id:req.admin._id});
                    sub.push({
                        ...data._doc,
                        subject: subject.Subject_Name
                    });
                    if (inx === (item.exams.length - 1)) finalResult.push({
                        ...item._doc,
                        teacher: teacher.Teacher_Name,
                        class: classes.Std_Name,
                        exams: sub
                    });
                    if ((exams.length - 1) === index) {
                        res.status(200).json({
                            error: false,
                            data: finalResult
                        });
                    }
                });
                return item;
            })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not get exams."
            })
        }
    },
    getRelevenceExams : async (req, res) => {
        try {
            const classid = req.student.class;
            const exams = await Exam.find({class : {_id : classid},Admin_Id:req.student.Admin_Id}).populate({ path: 'class', select: '_id Std_Name' }).populate({ path: 'exams.subject', select : '_id Subject_Name'});
            return res.status(200).json({
                error : false,
                data : exams
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not get exams."
            })
        }
    },
    getCreatedExamsByTeacher : async (req, res) => {
        try {
            const teacherId = req.teacher._id;
            const exams = await Exam.find({teacher : teacherId,Admin_Id:req.teacher.Admin_Id}).populate({ path: 'class', select: '_id Std_Name' }).populate({ path: 'exams.subject', select : '_id Subject_Name'});;
            return res.status(200).json({
                error : false,
                data : exams
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not get exams."
            })
        }
    },

    getExamsByClass : async (req, res) => {
        try {
            const {id} = req.params; 
            const exams = await Exam.find({
                class: {
                    _id: id
                }
            }).populate(['teacher', 'class','exams.subject']);
            return res.status(200).json({
                error : false,
                data : exams
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not get exams."
            })
        }
    },

    deleteExam : async (req, res) => {
        try {
            const {id} = req.params; 
            const exams = await Exam.findOneAndDelete({_id:id,Admin_Id:req.admin._id})
            return res.status(200).json({
                error : false,
                message : "Exam deleted successfully."
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not delete exams."
            })
        }
    },
    deleteExamByTeacher : async (req, res) => {
        try {
            const {id} = req.params; 
            const teacherid = req.teacher._id;
            const exam = await Exam.findOne({_id:id,teacher:teacherid,Admin_Id:req.teacher.Admin_Id});
            if (exam) {
                const exams = await Exam.findOneAndDelete({_id:id,teacher:teacherid,Admin_Id:req.teacher.Admin_Id});
                return res.status(200).json({
                    error : false,
                    message : "Exam deleted successfully."
                });    
            } else {
                return res.status(200).json({
                    error : true,
                    message : "you are Not creator of exam. || exam not found"
                });
            }
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not delete exams."
            })
        }
    },

    updateExamByAdmin: async (req, res) => {
        try {
            const {id} = req.params;
            const {classId,startDate,endDate,exams} = req.body;
            let sd = new Date(startDate);
            let ed = new Date(endDate);
            if (sd.getTime() > ed.getTime()) {
                return res.status(400).json({
                    error: true,
                    message: "Please enter proper dates."
                })
            }

            const exam = await Exam.findOneAndUpdate({_id:id,Admin_Id:req.admin._id}, {
                teacher: req.admin._id,
                class: classId,
                startDate: startDate,
                endDate: endDate,
                exams: exams
            });
            return res.status(200).json({
                error: false,
                message: "Exam updated.",
                data: exam
            })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not update exam."
            })
        }
    },
    updateExamByTeacher : async (req, res) => {
        const teacherId = req.teacher._id;
        try {
            const {id} = req.params;
            const { classId, startDate, endDate, exams} = req.body;
            let sd = new Date(startDate);
            let ed = new Date(endDate);
            const existingExam = await Exam.findOne({_id:id,teacher:teacherId,Admin_Id:req.teacher.Admin_Id});
            if (existingExam) {
                if (sd.getTime() > ed.getTime()) {
                    return res.status(400).json({
                        error : true,
                        message : "Please enter proper dates."
                    })
                }
                const exam = await Exam.findOneAndUpdate({_id:id,teacher:teacherId},{
                    teacher : teacherId,
                    class : classId,
                    startDate : startDate,
                    endDate : endDate,
                    exams : exams
                })
                exam.populate({ path: 'class', select: '_id Std_Name' }).populate({ path: 'exams.subject', select : '_id Subject_Name'});
                return res.status(200).json({
                    error : false,
                    message : "Exam updated.",
                    data : exam
                })    
            } else {
                return res.status(200).json({
                    error : true,
                    message : "Not authorized."
                });
            }
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not update exam."
            })
        }
    }
}