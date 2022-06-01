const bcrypt = require('bcryptjs')
// const Admin = require('../models/admin')
const SuperAdmin = require('../models/SuperAdmin')
const getError = require("../utils/dbErrorHandle");

module.exports = {

    loginSuperAdmin : async (req, res) => {
        try {
            const username = req.body.username
            const password = req.body.password
            const encryptedusername = await bcrypt.hash(process.env.USERNAME,8);
            const encryptedpass = await bcrypt.hash(process.env.PASSWORD,8);
            const ispassMatch = await bcrypt.compare(password,encryptedpass);
            const isuseMatch = await bcrypt.compare(username,encryptedusername);
            if(!ispassMatch || !isuseMatch){
                return res.status(400).json({
                    error: true,
                    message: 'unable to login SuperAdmin'
                })
            }
            else{
                const token = await SuperAdmin.generateAuthToken(encryptedusername,encryptedpass)
                return res.status(200).json({
                    error : false,
                    token : token
                })
            }
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Unable to login SuperAdmin"
            })
        }
    }
}