const mongoose=require('mongoose');

const CommentSchema = new mongoose.Schema({
    queryID:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        default:Date.now
    },
    commentBy:{
        type:String,
        required:true
    }
});

const comments=mongoose.model('comments',CommentSchema);
module.exports=comments;