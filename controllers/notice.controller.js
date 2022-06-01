const Notice = require("../models/Notice");
const getError = require("../utils/dbErrorHandle");
const mongoose = require('mongoose');

module.exports = {

    addNotice: async (req, res) => {
        try {

            const { Notice_Title, Notice_Details, Classes_Id } = req.body;

            const notice = Notice({
                Notice_Title: Notice_Title,
                Notice_Details: Notice_Details,
                Classes_Id: Classes_Id,
                Creator_Id: req.admin._id,
                Admin_Id:req.admin._id
            });
            await notice.save();
            return res.status(200).json({
                error: false,
                message: "Notice Posted."
            })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not post notice."
            })
        }
    },
    addNoticeByTeacher: async (req, res) => {
        try {

            const { Notice_Title, Notice_Details, Classes_Id } = req.body;
            const Creator_Id = req.teacher._id //should change this 

            const notice = Notice({
                Notice_Title: Notice_Title,
                Notice_Details: Notice_Details,
                Classes_Id: Classes_Id,
                Creator_Id: Creator_Id,
                Admin_Id:req.teacher.Admin_Id
            });
            await notice.save();
            await notice.populate(['Classes_Id.Class_Id', 'Creator_Id']);
            return res.status(200).json({
                error: false,
                message: "Notice Posted.",
                notice:notice
            })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not post notice."
            })
        }
    },
    getNoticeByIdTeacher: async (req, res) => {
        try {
            const { id } = req.params;
            const notices = await Notice.findOne({_id:id,Admin_Id:req.teacher.Admin_Id}).populate(['Classes_Id.Class_Id', 'Creator_Id']);
            return res.status(200).json({
                error: false,
                data: notices
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not get exams."
            })
        }
    },
    getNoticeByIdStudent: async (req, res) => {
        try {
            const { id } = req.params;
            const notices = await Notice.findOne({_id:id,Admin_Id:req.student.Admin_Id}).populate(['Classes_Id.Class_Id', 'Creator_Id']);
            return res.status(200).json({
                error: false,
                data: notices
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not get exams."
            })
        }
    },
    getNoticeByIdadmin: async (req, res) => {
        try {
            const { id } = req.params;
            const notices = await Notice.findOne({_id:id,Admin_Id:req.admin._id}).populate(['Classes_Id.Class_Id', 'Creator_Id']);
            return res.status(200).json({
                error: false,
                data: notices
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not get exams."
            })
        }
    },

    getallNotices: async (req, res) => {
        try {
            const notices = await Notice.find({Admin_Id:req.admin._id}).populate(['Classes_Id.Class_Id', 'Creator_Id']);
            return res.status(200).json({
                error: false,
                data: notices
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not get exams."
            })
        }
    },
    getallRelevenceNoticesStudent: async (req, res) => {
        try {
            const classId = req.student.class;
            const notices = await Notice.find({"Classes_Id.Class_Id":classId,Admin_Id:req.student.Admin_Id}).populate(['Classes_Id.Class_Id', 'Creator_Id']);
            return res.status(200).json({
                error: false,
                data: notices
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not get exams."
            })
        }
    },
    getallNoticesCreatedByHim: async (req, res) => {
        try {
            const notices = await Notice.find({Creator_Id:req.teacher._id,Admin_Id:req.teacher.Admin_Id}).populate(['Classes_Id.Class_Id', 'Creator_Id']); //update teacher authentication
            return res.status(200).json({
                error: false,
                data: notices
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not get exams."
            })
        }
    },

    deleteNoticeByAdmin: async (req, res) => {
        try {
            const { id } = req.params;
           const hello =  await Notice.findOneAndDelete({_id:id,Admin_Id:req.admin._id});
            return res.status(200).json({
                error: false,
                message: "Notice deleted successfully."
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not delete exams."
            })
        }
    },
    deleteNoticeByTeacher: async (req, res) => {
        try {
            const { id } = req.params;
           const hello = await Notice.findOneAndDelete({_id:id,Creator_Id: req.teacher._id,Admin_Id:req.teacher.Admin_Id})
           if(!hello){
               return res.status(400).json({
                   error: true,
                   message: "Notice doesn't exist or you are not creator."
               });
            }
        return res.status(200).json({
            error: false,
            message: "Notice deleted successfully."
        });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not delete exams."
            })
        }
    },

    updateNoticeByAdmin: async (req, res) => {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['Notice_Title', 'Notice_Details', 'Classes_Id']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).json({
                error: true,
                message: "updates are not valid"
            })
        }
        try {
            const { id } = req.params;
            const notice = await Notice.findOne({_id:id,Admin_Id:req.admin._id});

            if (!notice) {
                return res.status(400).json({
                    error: true,
                    message: "Notice doesn't exist"
                })
            }

            updates.forEach((update) => notice[update] = req.body[update])
            await notice.save()
            return res.status(200).json({
                error: false,
                message: "Notice updated.",
                data: notice
            })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not update Notice."
            })
        }
    },
    updateNoticeByTeacher: async (req, res) => {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['Notice_Title', 'Notice_Details', 'Classes_Id']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).json({
                error: true,
                message: "updates are not valid"
            })
        }
        try {
            const { id } = req.params;
            const notice = await Notice.findOne({_id:id,Creator_Id:req.teacher._id,Admin_Id:req.teacher.Admin_Id});
            // const notice = await Notice.findById(id);

            if (!notice) {
                return res.status(400).json({
                    error: true,
                    message: "Notice doesn't exist or You are not creator"
                })
            }

            updates.forEach((update) => notice[update] = req.body[update])
            await notice.save();
            await notice.populate(['Classes_Id.Class_Id', 'Creator_Id']);
            return res.status(200).json({
                error: false,
                message: "Exam updated.",
                data: notice
            })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not update Notice."
            })
        }
    }
}