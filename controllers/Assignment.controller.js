const Assignment = require('../models/Assignment');
module.exports = {
    
    getAssignment : async (req, res) => {
        try {
            const assignments = await Assignment.find({Admin_Id:req.admin._id}).populate(['class', 'subject', 'teacher']);
            return res.status(200).json({
                error : false,
                data : assignments
            })
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not get material"
            })
        }
    },
    getRelevenceAssignment : async (req, res) => {
        try {
            const classId = req.student.class
            const assignments = await Assignment.find({class:classId,Admin_Id:req.student.Admin_Id}).populate(['class', 'subject', 'teacher']);
            return res.status(200).json({
                error : false,
                data : assignments
            })
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not get material"
            })
        }
    },

    getAssignmentByClass : async (req, res) => {
        try {
            const {id} = req.params;
            const assignments = await Assignment.find({class : {_id : id},Admin_Id:req.admin._id}).populate(['class', 'subject', 'teacher']);
            return res.status(200).json({
                error : false,
                data : assignments
            })
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not get material"
            })
        }
    },

    getAssignmentBySubject : async (req, res) => {
        try {
            const {id} = req.params;
            const assignments = await Assignment.find({subject : { _id : id },Admin_Id:req.admin._id}).populate(['class', 'subject', 'teacher']);
            return res.status(200).json({
                error : false,
                data : assignments
            })
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not get material"
            })
        }
    },

    getAssignmentByTeacher : async (req, res) => {
        try {
            const id = req.teacher._id;
            const assignments = await Assignment.find({teacher : id,Admin_Id:req.teacher.Admin_Id}).populate(['class', 'subject', 'teacher']);
            return res.status(200).json({
                error : false,
                data : assignments
            })
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not get material"
            })
        }
    },
    getAssignmentOnly : async (req, res) => {
        try {
            const id = req.params.id;
            const assignments = await Assignment.findOne({_id:id,teacher:req.teacher._id,Admin_Id:req.teacher.Admin_Id}).populate(['class','subject','teacher']);
            if(!assignments){
                return res.status(400).json({
                    error: true,
                    message: "materail not found || You are not creator"
                })
            }
            else{
                return res.status(200).json({
                    error: false,
                    message: "material got successfully",
                    data: assignments
                })
            }
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not get material"
            })
        }
    },
    getAssignmentOnlyStudent : async (req, res) => {
        try {
            const id = req.params.id;
            const assignments = await Assignment.findOne({_id:id,Admin_Id:req.student.Admin_Id}).populate(['class','subject','teacher']);
            if(!assignments){
                return res.status(400).json({
                    error: true,
                    message: "materail not found || You are not creator"
                })
            }
            else{
                return res.status(200).json({
                    error: false,
                    message: "material got successfully",
                    data: assignments
                })
            }
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not get material"
            })
        }
    },

    addAssignment : async (req, res) => {
        try {
            const {classId, subjectId, details, AssignmentName,AssignmentData} = req.body;
            const material = Assignment({
                class : classId,
                subject : subjectId,
                details : details,
                AssignmentName : AssignmentName,
                AssignmentData : AssignmentData,
                teacher : req.teacher._id,
                Admin_Id:req.teacher.Admin_Id
            })

            await material.save();
            await material.populate(['class', 'subject', 'teacher']);
            return res.status(200).json({
                error: false,
                message: material
            })
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not add material"
            })
        }
    },

    updateAssignment : async (req, res) => {
        try {
            const {id} = req.params;
            const teacherId = req.teacher._id;
            const {classId, subjectId, details, AssignmentName,AssignmentData} = req.body;
            const material = await Assignment.findOneAndUpdate({_id:id,teacher:teacherId,Admin_Id:req.teacher.Admin_Id},{class : classId,
                subject : subjectId,
                details : details,
                AssignmentName : AssignmentName,
                AssignmentData : AssignmentData,
                teacher : teacherId});
            return res.status(200).json({
                error : false,
                message : "Assignment updated successfully.",
            });
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not updated material"
            })
        }
    },

    deleteAssignment : async (req, res) => {
        try {
            const {id} = req.params;
            const teacherId = req.teacher._id;
            await Assignment.findOneAndDelete({_id:id,teacher:teacherId,Admin_Id:req.teacher.Admin_Id})
            return res.status(200).json({
                error : false,
                message : "Assignment deleted successfully."
            });
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not delete material"
            })
        }
    }
}