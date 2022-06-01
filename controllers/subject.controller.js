const Subject = require('../models/Subject')
const Teacher = require('../models/Teacher')
const Class = require('../models/Class');
const getError = require("../utils/dbErrorHandle");

module.exports = {

    getSubject : async (req, res) => {
        try {
            const subjects = await Subject.find({Admin_Id:req.teacher.Admin_Id}).populate('Class_Id');
                return res.status(200).json({
                    error : false,
                    data : subjects
                })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not create class."
            })
        }
    },
    getSubjectadmin : async (req, res) => {
        try {
            const subjects = await Subject.find({Admin_Id:req.admin._id}).populate('Class_Id');
                return res.status(200).json({
                    error : false,
                    data : subjects
                })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not create class."
            })
        }
    },
    getSubjectById : async (req, res) => {
        try {
            // const subjects = await Subject.findById(req.params.id);
            const subjects = await Subject.findOne({_id:req.params.id,Admin_Id:req.admin._id}).populate('Class_Id');;
                return res.status(200).json({
                    error : false,
                    data : subjects
                })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not create class."
            })
        }
    },
    getSubjectByClassId : async (req, res) => {
        try {
            const subjects = await Subject.find({ Class_Id: req.params.id,Admin_Id:req.teacher.Admin_Id }).populate('Class_Id');
            return res.status(200).json({
                error: false,
                data: subjects
            })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not create class."
            })
        }
    },
    getSubjectByClassIdAdmin : async (req, res) => {
        try {
            const subjects = await Subject.find({ Class_Id: req.params.id,Admin_Id:req.admin._id }).populate('Class_Id');
            return res.status(200).json({
                error: false,
                data: subjects
            })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not create class."
            })
        }
    },
    getSubjectWithDetails : async (req,res) => {
        let detailSubject = [];
        try {
            const subject = await Subject.find({Admin_Id:req.admin._id}).populate('Class_Id');
            await subject.map(async (sub,index)=>{
                const currId = sub._id;
                const classes = sub.Class_Id
                const teachers = await Teacher.find({'Subjects_Id.Subject_Id':currId})
                await detailSubject.push({subName:sub.Subject_Name,classes:classes,teachers:teachers})
                if(index=== (subject.length -1)){
                    res.status(200).json({
                        error: false,
                        data: detailSubject
                    })
                }
                return sub;
            })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not create class."
            })
        }
    },
    addSubject : async (req, res) => {
        try {
            const {subName,Class_Id} = req.body;
            const newSubject = Subject({
                Subject_Name : subName,
                Class_Id : Class_Id,
                Admin_Id:req.admin._id
            });
            
            await newSubject.save()
            
            return res.status(200).json({
                error : false,
                message : "Subject created successfully",
                data : newSubject
            });

        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not create subject."
            })
        }
    },

    updateSubject : async (req, res) => {
        try {
            const {id} = req.params;
            const {Subject_Name,Class_Id} = req.body;
            const updatedClass = await Subject.findOneAndUpdate({_id:id,Admin_Id:req.admin._id},{
                Subject_Name : Subject_Name,
                Class_Id:Class_Id
            });
            return res.status(201).json({
                error : false,
                message : "Class updated successfully",
                data : updatedClass
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not create class."
            })
        }
    },
    deleteSubject : async (req, res) => {
        try {
            const {id} = req.params;
            const updatedClass = await Subject.findOneAndDelete({_id:id,Admin_Id:req.admin._id})
            return res.status(201).json({
                error : false,
                message : "Class deleted successfully",
                data : updatedClass
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not delete class."
            })
        }
    }

}

//