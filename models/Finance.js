const mongoose = require('mongoose')

const financeSchema = new mongoose.Schema({
    date:{
        type: Date,
        default: Date.now(),
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    amount:{
        type:Number,
        required: true,
    },
    income:{
        type: Boolean,
        required: true,
        default: false
    },
    expense:{
        type: Boolean,
        required: true,
        default: true
    },
    Admin_Id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'SchoolAdmin'
    }
},{
    timestamps: true
})
const Finance = mongoose.model('Finance', financeSchema);

module.exports = Finance