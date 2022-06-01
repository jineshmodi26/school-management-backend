const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const SchoolAdmin = require('../models/SchoolAdmin')
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.ADMIN_SECRET);
        const admin = await SchoolAdmin.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!admin) {
            res.status(200).json({
                error: true,
                check: false,
                message: "Please authenticate. with admin"
            })
        }
        req.token = token
        req.admin = admin
        next()
    } catch (e) {
        res.status(400).json({
            error: true,
            check: false,
            message: "Please authenticate. with admin"
        })
    }
}

module.exports = auth