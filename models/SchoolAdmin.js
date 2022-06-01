const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const adminSchema = new mongoose.Schema({
    SchoolName: {
        type: String,
        required: true,
        trim: true
    },
    UserName: {
        type: String,
        required: true,
        unique: true,
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
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

// adminSchema.virtual('notice', {
//     ref: 'Notice',
//     localField: '_id',
//     foreignField: 'Teacher_Id'
// })

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

adminSchema.methods.toJSON = function () {
    const teacher = this
    const teacherObject = teacher.toObject()
    delete teacherObject.password
    delete teacherObject.tokens

    return teacherObject
}

adminSchema.methods.generateAuthToken = async function () {
    const schoolAdmin = this
    const token = jwt.sign({ _id: schoolAdmin._id.toString() }, process.env.ADMIN_SECRET)
    schoolAdmin.tokens = schoolAdmin.tokens.concat({ token })
    await schoolAdmin.save()
    return token
}

adminSchema.statics.findByCredentials = async (UserName, password) => {

    const schoolAdmin = await SchoolAdmin.findOne({ UserName })

    if (!schoolAdmin) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, schoolAdmin.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return schoolAdmin
}

// Hash the plain text password before saving
adminSchema.pre('save', async function (next) {
    const teacher = this

    if (teacher.isModified('password')) {
        teacher.password = await bcrypt.hash(teacher.password, 8)
    }

    next()
})

// Delete teacher tasks when teacher is removed
adminSchema.pre('remove', async function (next) {
    const teacher = this
    next()
})

const SchoolAdmin = mongoose.model('SchoolAdmin', adminSchema)

module.exports = SchoolAdmin