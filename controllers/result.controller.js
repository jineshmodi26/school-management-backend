const Student = require("../models/Student");
const Exam = require("../models/Exam");
const Result = require("../models/Result");
const getError = require("../utils/dbErrorHandle");
const mongoose = require('mongoose')

module.exports = {
    
    // getResults : async (req, res) => {
    //     try {
    //         const results = await Result.find({}).populate(['exams.subject','exam']);
    //         return res.status(200).json({
    //             error : false,
    //             data : results
    //         })
    //     } catch (error) {
    //         let errMsg = getError(error)
    //         return res.status(400).json({
    //             error: true,
    //             message:  errMsg.length > 0 ? errMsg : "Could not get result."
    //         })
    //     }
    // },

    getResults : async (req, res) => {
        try {
            const results = await Result.find({Admin_Id:req.admin._id}).populate([{
                path : 'exam',
                populate : {
                  path : 'class'
                }
              },{path : 'exams.subject'},{path : 'student'}]);
            return res.status(200).json({
                error : false,
                data : results
            })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not get result."
            })
        }
    },

    getResultByExamId : async (req, res) => {
        try {
            const {id} = req.params;
            if (id.length !== 12 && id.length !== 24) {
                return res.status(400).json({
                    error : true,
                    message : "Exam doesn't exist"
                })
            }
            const exam = await Exam.findOne({_id : id,Admin_Id:req.teacher.Admin_Id});
            if (exam) {
                const results = await Result.find({exam : {_id : id},Admin_Id:req.teacher.Admin_Id}).populate([{
                    path : 'exam',
                    populate : {
                      path : 'class'
                    }
                  },{path : 'exams.subject'},{path : 'student'}]);
                return res.status(200).json({
                    error : false,
                    data : results
                })
            } else {
                return res.status(400).json({
                    error : true,
                    message : "Exam doesn't exist"
                })
            }
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not get result."
            })
        }
    },

    getResultByStudentId : async (req, res) => {
        try {
            const id = req.student._id;
            const results = await Result.find({student : id,Admin_Id:req.student.Admin_Id}).populate([{
                path : 'exam',
                populate : {
                  path : 'class'
                }
              },{path : 'exams.subject'},{path : 'student'}]);

                return res.status(200).json({
                    error : false,
                    data : results
                })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not get result."
            })
        }
    },

    addResult : async (req, res) => {
        try {
            const {exam, student, exams} = req.body;
            const result = Result({
                exam : exam,
                student : student,
                exams : exams,
                Admin_Id:req.admin._id,
                // teacher : req.teacher._id,
                teacher : req.admin._id
            });

            await result.save();

            return res.status(200).json({
                error : false,
                data : result,
                message : "Result added successfully."
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not add result."
            })
        }
    },

    updateResult : async (req, res) => {
        try {
            const {id} = req.params;
            if (id.length !== 12 && id.length !== 24) {
                return res.status(400).json({
                    error : true,
                    message : "Result doesn't exist"
                })
            }

            const result = await Result.findOne({_id : id,teacher:req.teacher._id,Admin_Id:req.teacher.Admin_Id});

            if (result) {
                const updatedResult = await Result.findByIdAndUpdate(id, {
                    exam : req.body.exam,
                    student : req.body.student,
                    exams : req.body.exams
                });
                await updatedResult.populate([{
                    path : 'exam',
                    populate : {
                      path : 'class'
                    }
                  },{path : 'exams.subject'},{path : 'student'}]);
                return res.status(200).json({
                    error : false,
                    data : updatedResult,
                    message : "Result updated successfully."
                })
            } else {
                return res.status(400).json({
                    error : true,
                    message : "Result doesn't exist or you'r not uploader"
                })
            }

        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not schedule exam."
            })
        }
    },
     
    deleteResult : async (req, res) => {
        const {id} = req.params;
            if (id.length !== 12 && id.length !== 24) {
                return res.status(400).json({
                    error : true,
                    message : "Result doesn't exist"
                })
            }
            const result = await Result.findOne({_id : id,teacher:req.teacher._id,Admin_Id:req.teacher.Admin_Id});
            if (result) {
                await Result.findByIdAndDelete(id);
                return res.status(200).json({
                    error : false,
                    message : "Result deleted successfully."
                })
            } else {
                return res.status(200).json({
                    error : true,
                    message : "Result doesn't exist or you are not uploader"
                })
            }
    }

}