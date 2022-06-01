const Student = require('../models/Student');
const Subject = require('../models/Subject')
const Teacher = require('../models/Teacher')
const Class = require('../models/Class');
const SchoolAdmin = require('../models/SchoolAdmin');
const getError = require("../utils/dbErrorHandle");

module.exports = {

    getClass : async (req, res) => {
        try {
            const classes = await Class.find({Admin_Id:req.admin._id});
                return res.status(200).json({
                    error : false,
                    data : classes
                })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not create class."
            })
        }
    },
    getClassById : async (req, res) => {
        try {
            const {id} = req.params;
            const classe = await Class.findOne({_id:id,Admin_Id:req.admin._id})
                return res.status(200).json({
                    error : false,
                    data : classe
                })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not create class."
            })
        }
    },
    getClassByIdDetails : async (req, res) => {
        try {
            const {id} = req.params;
            const clas = await Class.findOne({_id:id,Admin_Id:req.admin._id});
            const students = await Student.find({class : {_id : id},Admin_Id:req.admin._id});
            const subjects = await Subject.find({Class_Id : id,Admin_Id:req.admin._id});        
            const teachers = await Teacher.find({Admin_Id:req.admin._id}).populate({path : 'Subjects_Id.Subject_Id'})
            const teacherNames = [];
            await teachers.map(async (teacher) => {
                await subjects.map(async (subject) => {
                    await teacher.Subjects_Id.map(async (teacherSubject) => {
                        if (teacherSubject.Subject_Id._id.toString() === subject._id.toString()) {
                            await teacherNames.push(teacher);
                        }
                    });
                })
            });
            return res.status(200).json({
                    error : false,
                    data : {
                        class : clas,
                        totalStudents : students.length,
                        subjects : subjects,
                        teachers : teacherNames
                    }
                })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not create class."
            })
        }
    },
    getClassWithDetails: async (req, res) => {
        let detailClass = [];
        try {
            const classes = await Class.find({Admin_Id:req.admin._id});
            classes.map(async (cls, index) => {
                const students = await Student.find({
                    class: { _id: cls._id },
                    Admin_Id:req.admin._id
                }).populate("class");
                const subjects = await Subject.find({ Class_Id: cls._id,Admin_Id:req.admin._id });
                let totalTeacher = [];
                if (subjects.length === 0) {
                    detailClass.push({
                        Class_Id: cls._id,
                        STD: cls.Std_Name,
                        Students: students,
                        Teachers: totalTeacher,
                        Fees_Per_Student: cls.Fees_Per_Student,
                        Subjects: subjects,
                    });
                    if (index === (classes.length - 1)) {
                        res.status(200).json({
                            error: false,
                            data: detailClass,
                        });
                    }
                } else {
                    subjects.map(async (item, inx) => {
                        const teacher = await Teacher.find({ 'Subjects_Id.Subject_id': item._id,Admin_Id:req.admin._id });
                        totalTeacher.push(teacher);
                        if (inx === (subjects.length - 1)) {
                            detailClass.push({
                                Class_Id: cls._id,
                                STD: cls.Std_Name,
                                Students: students,
                                Teachers: totalTeacher,
                                Fees_Per_Student: cls.Fees_Per_Student,
                                Subjects: subjects,
                            });
                            if (index === (classes.length - 1)) {
                                res.status(200).json({
                                    error: false,
                                    data: detailClass,
                                });
                            }
                        }
                        return item;
                    })
                }
                return cls;
            });
        } catch (error) {
            let errMsg = getError(error);
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not create class.",
            });
        }
    },
    getClassWithDetailsTeacher: async (req, res) => {
        let detailClass = [];
        try {
            const classes = await Class.find({Admin_Id:req.teacher.Admin_Id});
            classes.map(async (cls, index) => {
                const students = await Student.find({
                    class: { _id: cls._id },
                    Admin_Id:req.teacher.Admin_Id
                }).populate("class");
                const subjects = await Subject.find({ Class_Id: cls._id,Admin_Id:req.teacher.Admin_Id });
                let totalTeacher = [];
                if (subjects.length === 0) {
                    detailClass.push({
                        Class_Id: cls._id,
                        STD: cls.Std_Name,
                        Students: students,
                        Teachers: totalTeacher,
                        Fees_Per_Student: cls.Fees_Per_Student,
                        Subjects: subjects,
                    });
                    if (index === (classes.length - 1)) {
                        res.status(200).json({
                            error: false,
                            data: detailClass,
                        });
                    }
                } else {
                    subjects.map(async (item, inx) => {
                        const teacher = await Teacher.find({ 'Subjects_Id.Subject_id': item._id,Admin_Id:req.teacher.Admin_Id });
                        totalTeacher.push(teacher);
                        if (inx === (subjects.length - 1)) {
                            detailClass.push({
                                Class_Id: cls._id,
                                STD: cls.Std_Name,
                                Students: students,
                                Teachers: totalTeacher,
                                Fees_Per_Student: cls.Fees_Per_Student,
                                Subjects: subjects,
                            });
                            if (index === (classes.length - 1)) {
                                res.status(200).json({
                                    error: false,
                                    data: detailClass,
                                });
                            }
                        }
                        return item;
                    })
                }
                return cls;
            });
        } catch (error) {
            let errMsg = getError(error);
            return res.status(400).json({
                error: true,
                message: errMsg.length > 0 ? errMsg : "Could not create class.",
            });
        }
    },
    // getClassWithDetails : async (req,res) => {
    //     let detailClass = [];
    //     try {
    //         const classes = await Class.find({});
    //         await classes.map(async (cls,index) => {
    //             const students = await Student.find({class : cls._id}).populate('class');
    //             const totalTeachers = await Teacher.find({'Classes_Id.Class_Id':cls._id})
    //             const subjects = await Subject.find({Class_Id:cls._id})
    //             await detailClass.push({STD : cls.Std_Name,totalStudents : students.length,totalTeachers: totalTeachers.length,Fees_Per_Student: cls.Fees_Per_Student,totalSubjects:subjects.length});
    //             if(index=== (classes.length -1)){
    //                 res.status(200).json({
    //                     error: false,
    //                     data: detailClass
    //                 })
    //             }
    //             return cls;
    //         })
    //     } catch (error) {
    //         let errMsg = getError(error)
    //         return res.status(400).json({
    //             error: true,
    //             message:  errMsg.length > 0 ? errMsg : "Could not create class."
    //         })
    //     }
    // },

    addClass : async (req, res) => {
        try {
            const admin = await SchoolAdmin.findById(req.admin._id);
            const schoolUnique = admin.SchoolName.split(' ')[0];
            const {stdName,feesPerStudent} = req.body;
            const newClass = Class({
                Std_Name : `${schoolUnique}__${stdName}`,
                Fees_Per_Student : feesPerStudent,
                Admin_Id: req.admin._id
            });
            
            await newClass.save();
            
            return res.status(200).json({
                error : false,
                message : "Class created successfully",
                data : newClass
            });

        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not create class."
            })
        }
    },

    updateClass : async (req, res) => {
        try {
            const {id} = req.params;
            const {Fees_Per_Student,Std_Name} = req.body;
            // const oldClass = await Class.findOne({_id : id});
            // let oldFees = oldClass.Fees_Per_Student;
            const updateClass = await Class.findOneAndUpdate({_id:id,Admin_Id:req.admin._id},{
                Std_Name:Std_Name,
                Fees_Per_Student : Fees_Per_Student,
            })
            // const updatedClass = await Class.findByIdAndUpdate(id,{
            //     Std_Name:Std_Name,
            //     Fees_Per_Student : Fees_Per_Student,
            // });
            return res.status(201).json({
                error : false,
                message : "Class updated successfully"
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not create class."
            })
        }
    },
    deleteClass : async (req, res) => {
        try {
            const {id} = req.params;
            await Class.findOneAndDelete({_id:id,Admin_Id:req.admin._id});
            // const updatedClass = await Class.findByIdAndDelete(id);
            return res.status(201).json({
                error : false,
                message : "Class deleted successfully"
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not create class."
            })
        }
    }

}

//