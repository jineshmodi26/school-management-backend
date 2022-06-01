const mongoose = require('mongoose');

const resultSchema = mongoose.Schema({
    exam : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Exam",
        required : [true, "Exam ID is required"]
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Teacher",
        require : [true,"Uploader Id is required"]
    },
    student : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Student",
        required : [true, "Student ID is required"]
    },
    exams: [
        {
            subject : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Subject",
                required : [true, "Subject is required"]
            },
            marks : {
                type : Number,
                required : [true, "Marks is required"]
            }
        }
    ],
    Admin_Id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'SchoolAdmin'
    }
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result