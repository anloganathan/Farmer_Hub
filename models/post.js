const mongoose=require('mongoose');

const PostSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    query:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        default:Date.now
    }
});

const Post=mongoose.model('Post',PostSchema);
module.exports=Post;