require('dotenv').config();

const express=require('express');
const router=express.Router();



//User model
const User=require('../models/User');

//login page
router.get('/',(req,res)=>{
    res.redirect('/users/login');
});

//login page
router.get('/login',(req,res)=>{
    res.render('login');
});


//register handle
router.post('/register',(req,res)=>{
    console.log(req.body);
   const {name,email,password,password2}=req.body;

   let errors=[];
   //check required field
   if(!name || !email || !password || !password2){
       errors.push({msg: 'Please fill all fields'});
   }

   if(password!==password2){
       errors.push({msg:'Passwords do not match'});
   }

   if(errors.length>0){

        res.render('login',{errors:errors});
        
   }
   else{
       //Validation passed
       User.findOne({email:email},(err,user)=>{
           console.log(user);
           if(err){
               console.log(err);
           }
           else{
            if(user!=null){
                //user exits
                errors.push({msg:'Email is Already Registered!'});
                res.render('login',{errors:errors});
            }else{
                 const newuser= new User({
                     name:name,
                     email:email,
                     password
                 });
                  
                newuser.save()
                .then(()=>{
                    req.flash('success_msg','You are registered successfully!');
                    req.session.user = newuser;
                    res.redirect('/dashboard');
                })
                .catch(err=>console.log(err));
            }
           }
       })
   }

});

router.post('/login',(req,res,next)=>{
    if(!req.body.email || !req.body.password){
        
        res.render('login',{error_msg:'Please fill all the fields'});
    }
    else{
        User.findOne({email:req.body.email},(err,user)=>{
            if(err){
                console.log(err);
            }
            else{
                if(user!=null && user.password==req.body.password){
                    req.session.user = user;
                    res.redirect('/dashboard');
                }
                else{
                    res.render('login',{error_msg:'Oops!..Either Email or Password is incorrect!'})
                }
            }
        })
    }
});

//logout handle
router.get('/logout',(req,res)=>{
    
    req.flash('success_msg','You are Logged Out');
    req.session.destroy(function(){
        console.log("user logged out.")
     });
    res.redirect('/users/login');
})
module.exports=router;