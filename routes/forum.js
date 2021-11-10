const express=require('express');
const router=express.Router();
const {ensureAuthenticated}=require('../config/auth');
const Post=require('../models/post');
const comments=require('../models/comments');
const { compareSync } = require('bcryptjs');

router.post('/',ensureAuthenticated,(req,res)=>{
    var obj=new Post({
        name:req.user.name,
        query:req.body.post,
        time:Date.now()
    });
    obj.save((err,r)=>{
        if(err){
            console.log("error saving the post...");
            res.render('forum',{error_msg:"Error occurred..Please try again",name:req.user.name});
        }
        else{
            console.log("Post is saved Successfully");
        }
    });
    
    console.log(obj);
    req.flash('success_msg','Successfully Posted!..');
    res.redirect('/forum');
});

router.get('/',ensureAuthenticated,(req,res)=>{
    Post.find({},(err,r)=>{
        if(err){
            console.log("Error Fetching posts..");
            res.render('forum',{
                name:req.user.name
            });
        }
        else{
            //console.log(r);
            res.render('forum',{posts:r,name:req.user.name});
        }
    }).sort({_id:-1}).limit(10);
});

router.get('/loadComments/:id',(req,res)=>{
    comments.find({queryID:req.params.id},(err,r)=>{
        if(err){
            console.log("Error fetching comments...");
        }
        else{
            console.log("Feteched comments");
            res.send(JSON.stringify(r));
        }
    })
});

router.post('/reply',(req,res)=>{
    console.log(req.body);
    var reply=new comments({
        queryID:req.body.queryID,
        comment:req.body.reply,
        commentBy:req.body.name,
        time:formatted_date()
    });
    reply.save((e,r)=>{
        if(e){
            console.log(e);
            console.log("Error pushing comment to db");
        }
        else{
            console.log("Comment saved!");
        }
    })
    req.flash('success_msg','Reply Posted!..');
    res.redirect('/forum');

})

router.get('/deletePost/:id',(req,res)=>{
    Post.findByIdAndRemove(req.params.id,(err,r)=>{
        if(err){
            console.log("Error deletng post...");
        }
        else{
            console.log("Deleted Post");
            comments.deleteMany({queryID:req.params.id},(e,re)=>{
                if(err){
                    console.log("error deleting replies..");
                }
                else{
                    console.log("Comments Deleted");
                    req.flash('success_msg','Post Deleted Successfully!..');
                    res.send("PostDeleted");
                }
            })
        }
    })
});

router.get('/deleteComment/:id',(req,res)=>{
    comments.deleteOne({_id:req.params.id},(err,response)=>{
        if(err){
            console.log(err);
            console.log("Error deleting comment");
        }
        else{
            console.log(response);
            console.log("Comment deleted....");
            req.flash('success_msg','Comment Deleted Successfully!..');
            res.send("CommentDeleted")
        }
    })
});

function formatted_date()
{
   var result="";
   var d = new Date(Date.now());
   result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() + 
             " "+ d.getHours()+":"+d.getMinutes();
   return result;
}


module.exports=router;