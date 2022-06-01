const bcrypt = require('bcryptjs')
const SchoolAdmin = require('../models/SchoolAdmin')
const getError = require("../utils/dbErrorHandle");

module.exports = {
    checkAdmin: async(req,res)=>{
        try {
            if(req.admin){
                return res.status(200).json({
                    error : false,
                    check: true,
                    message : "Admin authentication Successfully passed",
                });
            }
            else{
                return res.status(200).json({
                    error: true,
                    check: false,
                    message:  "please Authenticate with admin"
                })
            }
        } catch (error) {
            return res.status(400).json({
                error: true,
                check: false,
                message:  "please Authenticate"
            })
        }
    },
    addAdmin : async (req ,res) => {
        try {
            const {SchoolName,UserName,password} = req.body;
                const admin = SchoolAdmin({
                    SchoolName : SchoolName,
                    UserName : UserName,
                    password : password,
                })
                await admin.save();
                const token = await admin.generateAuthToken()
                return res.status(200).json({
                    error : false,
                    message : "Admin Created Successfully",
                    token : token
                });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not create Admin."
            })

        }
    },
    loginAdmin : async (req, res) => {
        try {
            const admin = await SchoolAdmin.findByCredentials(req.body.UserName,req.body.password);
            const token = await admin.generateAuthToken()
            return res.status(200).json({
                error : false,
                token : token,
                SchoolName: admin.SchoolName,
            })
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: "Unable to login"
            })
        }
    },
    logoutAdmin : async(req,res)=>{
        try {
            req.admin.tokens = req.admin.tokens.filter((token) => {
                return token.token !== req.token
            })
            await req.admin.save()
            return res.status(200).json({
                error : false,
                message: "Admin loggedout successfully"
            })
        } catch (e) {
            res.status(400).send()
        }
    },
    getAdmins :async(req,res)=>{
        try{
            const admins = await SchoolAdmin.find({});
            return res.status(200).json({
                error : false,
                data : admins
            }); 
        }catch(error){
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Error Occurred."
            })
        }
    },
    getAdminById :async(req,res)=>{
        try{
            const {id} = req.params;
            const admin = await SchoolAdmin.findById(id);
            return res.status(200).json({
                error : false,
                data : admin
            }); 
        }catch(error){
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Error Occurred."
            })
        }
    },
    updateAdminById :async(req,res)=>{
        try {
            const {id} = req.params;
            const admin = await SchoolAdmin.findById(id);
            if(admin){
                const updates = Object.keys(req.body)
                const allowedUpdates = ['SchoolName', 'username', 'password']
                const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
                if (!isValidOperation) {
                    return res.status(400).send({ error: 'Invalid updates!' })
                }
                updates.forEach((update) => admin[update] = req.body[update])
                await admin.save()
                return res.status(200).json({
                    error : false,
                    message : "Admin updated successfully.",
                    data : admin
                })
            }
            else{
                return res.status(400).json({
                    error : true,
                    message : "Admin doesn't exist"
                })
            }

        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Teacher not updated."
            })
        }
    },
    deleteAdminById :async(req,res)=>{
        try {
            const {id} = req.params;
            if (id.length !== 12 && id.length !== 24) {
                return res.status(400).json({
                    error : true,
                    message : "admin doesn't exist"
                })
            }
            const admin = await SchoolAdmin.findByIdAndDelete(id);
            if (admin) {
                return res.status(200).json({
                    error : false,
                    message : "admin deleted successfully."
                })
            } else {
                return res.status(400).json({
                    error : true,
                    message : "admin doesn't exist."
                })
            }
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Admin not deleted."
            })
        }
    }

}