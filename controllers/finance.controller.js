const Finance = require('../models/Finance')
// const Teacher = require('../models/Teacher')
// const auth = require('../middleware/auth')
// const Student = require('../models/Student');
// const Class = require('../models/Class');
const getError = require("../utils/dbErrorHandle");

module.exports = {

    getFinancess : async (req, res) => {
        try {
            const startDate = new Date(req.params.startDate);
            const endDate = new Date( req.params.endDate);
            endDate.setTime(endDate.getTime() +1);
            const finance = await Finance.find({date: {$gte: startDate, $lt: endDate},Admin_Id:req.admin._id});
                return res.status(200).json({
                    error : false,
                    data : finance
                })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not get Finance."
            })
        }
    },
    getFinancessById : async (req, res) => {
        try {
            const {id} = req.params;
            const finance = await Finance.findOne({_id:id,Admin_Id:req.admin._id});
                return res.status(200).json({
                    error : false,
                    data : finance
                })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not get Finance."
            })
        }
    },
    getFinanceTotal : async(req,res) =>{
        try {
            let totalIncom = 0;
            let totalExpence = 0;
            let total = 0;
            const finance = await Finance.find({Admin_Id:req.admin._id});
            const ais = await finance.map(async(fin)=>{
                if(fin.income){
                    totalIncom += fin.amount;
                }
                else{
                    totalExpence += fin.amount;
                }
            })
            total = totalIncom-totalExpence;
                return res.status(200).json({
                    error : false,
                    data : [
                        {
                            "income":totalIncom
                        },
                        {
                            "expence":totalExpence
                        },
                        {
                            "total":total
                        }]
                })
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not get total Finance."
            })
        }
    },
    addFinance : async (req, res) => {
        try {
            const {date,description,amount,finance} = req.body;
            const finances = Finance({
                date : date,
                description : description,
                amount : amount,
                income : !finance,
                expense : finance,
                Admin_Id:req.admin._id
            });
            
            await finances.save()
            
            return res.status(200).json({
                error : false,
                message : "Finance created successfully",
                data : finances
            });

        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not create Finance."
            })
        }
    },
    updateFinance : async (req, res) => {
        try {
            const {id} = req.params;
            const {date,description,amount,finance} = req.body;
            const updatedFinance = await Finance.findOneAndUpdate({_id:id,Admin_Id:req.admin._id},{
                date : date,
                description : description,
                amount : amount,
                income : !finance,
                expense : finance
            });
            return res.status(201).json({
                error : false,
                message : "Finances updated successfully",
                data : updatedFinance
            });
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not update Finance."
            })
        }
    },
    deleteFinance : async (req, res) => {
        try {
            const {id} = req.params;
            const fi = await Finance.findOne({_id:id,Admin_Id:req.admin._id});
            if(fi){
                await Finance.findByIdAndDelete(id);
                return res.status(201).json({
                    error : false,
                    message : "Finances updated successfully",
                });
            }
            else{
                return res.status(400).json({
                    error : true,
                    message : "Finances Not Found",
                });
            }
        } catch (error) {
            let errMsg = getError(error)
            return res.status(400).json({
                error: true,
                message:  errMsg.length > 0 ? errMsg : "Could not update Finance."
            })
        }
    }

}

//