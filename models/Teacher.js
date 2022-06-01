const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const teacherSchema = new mongoose.Schema({
    Teacher_Name: {
        type: String,
        required: true,
        trim: true
    },
    UserName: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    Salary: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    Subjects_Id: [{
        Subject_Id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Subject'
        }
    }],
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
}, {
    timestamps: true
})

teacherSchema.virtual('notice', {
    ref: 'Notice',
    localField: '_id',
    foreignField: 'Teacher_Id'
})

// teacherSchema.methods.addClass(classid) = async function(){
//     const teacher = this
//     teacher.Classes_Id = teacher.Classes_Id.concat({classid});
//     await teacher.save()
//     return classid
// }

// teacherSchema.methods.addSubject(subjectid) = async function(){
//     const teacher = this
//     teacher.Subjects_Id = teacher.Subjects_Id.concat({subjectid});
//     await teacher.save()
//     return subjectid
// }

teacherSchema.methods.toJSON = function () {
    const teacher = this
    const teacherObject = teacher.toObject()

    delete teacherObject.password
    delete teacherObject.tokens

    return teacherObject
}

teacherSchema.methods.generateAuthToken = async function () {
    const teacher = this
    const token = jwt.sign({ _id: teacher._id.toString() }, process.env.SCHOOL_SECRET)
    teacher.tokens = teacher.tokens.concat({ token })
    await teacher.save()
    return token
}

teacherSchema.statics.findByCredentials = async (UserName, password) => {
    const teacher = await Teacher.findOne({ UserName })

    if (!teacher) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, teacher.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return teacher
}

// Hash the plain text password before saving
teacherSchema.pre('save', async function (next) {
    const teacher = this

    if (teacher.isModified('password')) {
        teacher.password = await bcrypt.hash(teacher.password, 8)
    }

    next()
})

// Delete teacher tasks when teacher is removed
teacherSchema.pre('remove', async function (next) {
    const teacher = this
    next()
})

const Teacher = mongoose.model('Teacher', teacherSchema)

module.exports = Teacher