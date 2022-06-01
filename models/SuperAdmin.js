const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const superAdminSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


superAdminSchema.statics.generateAuthToken = async function (username,epassword) {
    const token =await jwt.sign({ username: username,password:epassword }, process.env.SUPER_ADMIN_SECRET,{expiresIn: 60*5});
    return token
}

const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema)

module.exports = SuperAdmin