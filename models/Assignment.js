const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema({
    class : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Class",
        required : [true, "Class is required"]
    },
    subject : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Subject",
        required : [true, "Subject is required"]
    },
    details : {
        type : String
    },
    AssignmentName : {
        type : String,
        required : [true, "Assignment name is required"]
    },
    AssignmentData : {
        type : String,
        required : [true, "Assignment data is required"]
    },
    teacher : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Teacher",
        required : [true, "Teacher is required"]
    },
    Admin_Id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'SchoolAdmin'
    }
});

const Assignment = mongoose.model('Assignment',assignmentSchema);

module.exports = Assignment