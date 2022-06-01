const mongoose = require('mongoose')
const subjectSchema = new mongoose.Schema({
    Subject_Name:{
        type: String,
        required: true,
    },
    Class_Id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Class'
    },
    Admin_Id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'SchoolAdmin'
    }
},{
    timestamps: true
})
subjectSchema.virtual('teachers', {
    ref: 'Teacher',
    localField: '_id',
    foreignField: 'Subjects_Id.Subject_Id'
})
const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject