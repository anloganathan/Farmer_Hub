const express=require('express');
const router=express.Router();
const {ensureAuthenticated}=require('../config/auth');
const Post=require('../models/post');

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
            console.log(r);
            res.render('forum',{posts:r,name:req.user.name});
        }
    }).sort({_id:-1}).limit(10);
});


module.exports=router;