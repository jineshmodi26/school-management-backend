const Material = require('../models/Material');
module.exports = {
    
    getMaterial : async (req, res) => {
        try {
            const materials = await Material.find({Admin_Id:req.admin._id}).populate(['class', 'subject', 'teacher']);
            return res.status(200).json({
                error : false,
                data : materials
            })
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not get material"
            })
        }
    },
    getRelevenceMaterial : async (req, res) => {
        try {
            const classId = req.student.class
            const materials = await Material.find({class:classId,Admin_Id:req.student.Admin_Id}).populate(['class', 'subject', 'teacher']);
            return res.status(200).json({
                error : false,
                data : materials
            })
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not get material"
            })
        }
    },

    getMaterialByClass : async (req, res) => {
        try {
            const {id} = req.params;
            const materials = await Material.find({class : {_id : id},Admin_Id:req.admin._id}).populate(['class', 'subject', 'teacher']);
            return res.status(200).json({
                error : false,
                data : materials
            })
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not get material"
            })
        }
    },

    getMaterialBySubject : async (req, res) => {
        try {
            const {id} = req.params;
            const materials = await Material.find({subject : { _id : id },Admin_Id:req.admin._id}).populate(['class', 'subject', 'teacher']);
            return res.status(200).json({
                error : false,
                data : materials
            })
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not get material"
            })
        }
    },

    getMaterialByTeacher : async (req, res) => {
        try {
            const id = req.teacher._id;
            const materials = await Material.find({teacher : id,Admin_Id:req.teacher.Admin_Id}).populate(['class', 'subject', 'teacher']);
            return res.status(200).json({
                error : false,
                data : materials
            })
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not get material"
            })
        }
    },
    getMaterialOnly : async (req, res) => {
        try {
            const id = req.params.id;
            const materials = await Material.findOne({_id:id,teacher:req.teacher._id,Admin_Id:req.teacher.Admin_Id}).populate(['class', 'subject', 'teacher']);
            if(!materials){
                return res.status(400).json({
                    error: true,
                    message: "materail not found || You are not creator"
                })
            }
            else{
                return res.status(200).json({
                    error: false,
                    message: "material got successfully",
                    data: materials
                })
            }
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not get material"
            })
        }
    },
    getMaterialOnlyStudent : async (req, res) => {
        try {
            const id = req.params.id;
            const materials = await Material.findOne({_id:id,Admin_Id:req.student.Admin_Id})
            if(!materials){
                return res.status(400).json({
                    error: true,
                    message: "materail not found || You are not creator"
                })
            }
            else{
                return res.status(200).json({
                    error: false,
                    message: "material got successfully",
                    data: materials
                })
            }
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not get material"
            })
        }
    },

    addMaterial : async (req, res) => {
        try {
            const {classId, subjectId, details, fileName,fileData} = req.body;
            const material = Material({
                class : classId,
                subject : subjectId,
                details : details,
                fileName : fileName,
                fileData : fileData,
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

    updateMaterial : async (req, res) => {
        try {
            const {id} = req.params;
            const teacherId = req.teacher._id;
            const {classId, subjectId, details, fileName,fileData} = req.body;
            const material = await Material.findOneAndUpdate({_id:id,teacher:teacherId,Admin_Id:req.teacher.Admin_Id},{class : classId,
                subject : subjectId,
                details : details,
                fileName : fileName,
                fileData : fileData,
                teacher : teacherId});
            return res.status(200).json({
                error : false,
                message : "Material updated successfully.",
            });
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not updated material"
            })
        }
    },

    deleteMaterial : async (req, res) => {
        try {
            const {id} = req.params;
            const teacherId = req.teacher._id;
            await Material.findOneAndDelete({_id:id,teacher:teacherId,Admin_Id:req.teacher.Admin_Id})
            return res.status(200).json({
                error : false,
                message : "Material deleted successfully."
            });
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Could not delete material"
            })
        }
    }
}