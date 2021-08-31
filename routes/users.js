require('dotenv').config();

const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const passport=require('passport');
var nodemailer = require('nodemailer');

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

//register page
router.get('/register',(req,res)=>{
    res.render('register');
});

//register handle
router.post('/register',(req,res)=>{
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
        res.render('register',{
        errors,
        name,
        email,
        password,
        password2
        });
        
   }
   else{
       //Validation passed
       User.findOne({email:email})
       .then(user=>{
           if(user){
               //user exits
               errors.push({msg:'Email is Already Registered!'});
               res.render('register',{
                errors,
                name,
                email,
                password,
                password2
                });
           }else{
                const newuser= new User({
                    name:name,
                    email:email,
                    password
                });
                
                //hash password
                bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newuser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        
                        //set password as hash
                        newuser.password=hash;
                        //save user instance
                        newuser.save()
                        .then(user=>{
                            req.flash('success_msg','You are registered successfully!');
                            /*var transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                  user: process.env.guser,
                                  pass: process.env.gpass
                                }
                              });
                              
                              var mailOptions = {
                                from: process.env.gpass,
                                to: user.email,
                                subject: 'Sending Email using Node.js',
                                text: 'You are registered successfully!'
                              };
                              
                              transporter.sendMail(mailOptions, function(error, info){
                                if (error) {
                                  console.log(error);
                                } else {
                                  console.log('Email sent',info.response);
                                }
                              });*/
                            //req.flash('error_msg','Something went wrong!');
                            res.redirect('/users/login');
                        })
                        .catch(err=>console.log(err));

                    })
                })
           }
       })
   }

});

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});

//logout handle
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are Logged Out');
    res.redirect('/users/login');
})
module.exports=router;