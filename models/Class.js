const mongoose = require('mongoose')

const classSchema = new mongoose.Schema({
    Std_Name: {
        type: String,
        unique: true,
        required: [true, "Please enter standard name"],
    },
    Fees_Per_Student: {
        type: Number,
        required: [true, "Please enter fees"],
    },
    Admin_Id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'SchoolAdmin'
    }
}, {
    timestamps: true
})
classSchema.virtual('teacher', {
    ref: 'Teacher',
    localField: '_id',
    foreignField: 'Class_Id'
})
classSchema.virtual('notice', {
    ref: 'Notice',
    localField: '_id',
    foreignField: 'Class_Id'
})

const Class = mongoose.model('Class', classSchema);

module.exports = Class
