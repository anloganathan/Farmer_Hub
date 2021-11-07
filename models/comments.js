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
        type:String,
        required:true
    },
    commentBy:{
        type:String,
        required:true
    }
});

const comments=mongoose.model('comments',CommentSchema);
module.exports=comments;