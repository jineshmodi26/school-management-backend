const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const studentSchema = mongoose.Schema({
    studentID : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    studentName : {
        type : String,
        required : [true, "Student name is required"]
    },
    fatherName : {
        type : String,
        required : [true, "Father name is required"]
    },
    address : {
        type : String,
        required : [true, "Address is required"]
    },
    phoneNumber : {
        type : String,
        required : [true, "Phone number is required"],
        validate(value) {
            const regex = /^[6-9]\d{9}$/
            if (regex.test(value) === false) {
                throw new Error('Invalid phone number')
            }
        }
    },
    password : {
        type : String,
        minLength : [7,"Password is too short"],
        maxLength : [100,"Password is too long"],
        required : [true, "Password is required"]
    },
    attendence : [
        {
            subjectID : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Subject"
            },
            present : {
                type : Boolean,
                default : false
            }
        }
    ],
    class : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Class",
        required : [true, "Class is required"]
    },
    pendingFees : {
        type : Number
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    Admin_Id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'SchoolAdmin'
    }
},{
    timestamps: true
});
studentSchema.methods.generateAuthToken = async function () {
    const student = this

    const token = jwt.sign({ _id: student._id.toString() }, process.env.SCHOOL_SECRET)
    student.tokens = student.tokens.concat({ token })
    await student.save()
    return token
}

studentSchema.statics.findByCredentials = async (studentID, password) => {
    const student = await Student.findOne({ studentID })

    if (!student) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, student.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return student
}
studentSchema.pre('save', function (next) {
    var student = this;
    if (!student.isModified('password')) return next();
    bcrypt.hash(student.password, 10, function(err, hash) {
        if (err) return next(err);
        student.password = hash;
        next();
    });
})

const Student = mongoose.model('Student', studentSchema);

module.exports = Student