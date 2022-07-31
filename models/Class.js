const mongoose = require('mongoose')

const classSchema = new mongoose.Schema({
    Std_Name: {
        type: String,
        unique: true,
        required: [true, "Please enter standard name"],
	match : [/^[A-Za-z]+[_][_](1|2|3|4|5|6|7|8|9|10|11|12)[_][A-F]$/,"Invalid format of Std_Name"],
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

classSchema.methods.toJSON = function () {
	const classe = this
	let classObject = classe.toObject()
	let navustd = classObject.Std_Name.split('__')[1];
	classObject.Std_Name = navustd;
	return classObject;
}

const Class = mongoose.model('Class', classSchema);

module.exports = Class
