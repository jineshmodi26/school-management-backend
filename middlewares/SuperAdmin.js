const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Superauth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.SUPER_ADMIN_SECRET);
        const isUseMatch = await bcrypt.compare(process.env.USERNAME,decoded.username);
        const isPassMatch = await bcrypt.compare(process.env.PASSWORD,decoded.password);
        if(isUseMatch && isPassMatch){
            req.token = token
            req.isauth = true
            next()
        }
        else{
            res.status(401).send({error: 'please login again'})
        }
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate. with Super Admin' })
    }
}

module.exports = Superauth