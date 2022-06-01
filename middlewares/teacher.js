const jwt = require('jsonwebtoken')
const Teacher = require('../models/Teacher')

const tauth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.SCHOOL_SECRET);
        const teacher = await Teacher.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!teacher) {
            throw new Error()
        }
        req.token = token
        req.teacher = teacher
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate. with teacher username and password' })
    }
}

module.exports = tauth