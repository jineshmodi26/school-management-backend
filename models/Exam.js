const mongoose = require('mongoose');

const examSchema = mongoose.Schema({
    
    teacher : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Teacher",
        required : [true, "Teacher is required"]
    },
    class : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Class",
        required : [true, "Class is required"]
    },
    startDate : {
        type : Date,
        required : [true, "Start date is required"]
    },
    endDate : {
        type : Date,
        required : [true, "End is required"]
    },
    exams : [
        {
            startTime : {
                type : String,
                required : [true, "Start time is required"]
            },
            endTime : {
                type : String,
                required : [true, "End is required"]
            },
            date : {
                type : Date,
                required : [true, "Date is required"]
            },
            subject : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Subject",
                required : [true, "Subject is required"]
            }
        }
    ],
    Admin_Id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'SchoolAdmin'
    }
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam