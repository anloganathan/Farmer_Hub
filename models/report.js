const mongoose=require('mongoose');

const reportSchema = new mongoose.Schema({
    disease:{
        type:String,
        required:true
    },
    plant:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    remedy:{
        type:String,
        required:true
    },
    img:
    {
        data: Buffer,
        contentType: String
    }
});

const report=mongoose.model('report',reportSchema);
module.exports=report;