const express=require('express');
const router=express.Router();
var fs = require('fs');
var path = require('path');
const report=require('../models/report');
const fetch = require('node-fetch');
var multer = require('multer');
var app=express();
app.use(express.static('uploads'));
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,path.join(__dirname+'/uploads'))
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 

var upload = multer({ storage: storage });

var APIurl = "https://plant-disease-detector-pytorch.herokuapp.com/"

router.get('/',(req,res)=>{
    res.render('welcome');
});

function ensureAuthenticated(req, res,next){
    if(req.session.user){
       next();     //If session exists, proceed to page
    } else {
      // var err = new Error("Not logged in!");
       console.log(req.session.user);
       //next(err);  //Error, trying to access unauthorized page!
       req.flash('error_msg','Please login to view this resource');
        res.redirect('/users/login');
    }
 }

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        user:req.session.user,
        disease:"",
        plant:"",
        remedy:""
    });
})

router.post('/upload', upload.single('image'),ensureAuthenticated,(req, res) => {

    var imgPath=path.join(__dirname + '/uploads/' + req.file.filename);
    fetch(APIurl, { 
        method: 'POST', 
        body:JSON.stringify({
            "image":ImgToBase64(imgPath.toString())
        }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(r => r.json()) // expecting a json response
    .then(json => {
        //console.log("data : ")
       // console.log(json);

       var obj = {
            img: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: 'image/png'
            },
            disease:json.disease,
            plant:json.plant,
            remedy:json.remedy,
            time:formatted_date(),
            user:req.body.user
        }

        report.create(obj, (err, item) => {
            if (err) {
                console.log(err);
            }
            else {
                // item.save();
                console.log("Report saved");
            }
        });

        res.render('dashboard',{
            user:req.session.user,
            disease:json.disease,
            plant:json.plant,
            remedy:json.remedy
        });
        fs.unlink(imgPath,err=>{
            if(err){
                console.log("error deleting temp image file");
            }
        })
    })
    .catch(err =>{
        console.log("Error in Procesing")
        console.log(err);
        
        res.redirect('/dashboard');
    });
    
});

router.get('/prevReport',ensureAuthenticated,(req,res)=>{
    report.find({user:req.session.user.name}, (err, items) => {
        if (err) {
            console.log(err);
        }
        else {
            //res.send(items);
            res.render('report',{items:items,user:req.session.user});
        }
    }).sort({_id:-1}).limit(1);
});

router.get('/loadMorePrevReports',ensureAuthenticated,(req,res)=>{
    report.find({user:req.session.user.name}, (err, items) => {
        if (err) {
            console.log(err);
        }
        else {
            //res.send(items);
            res.render('report',{items:items,user:req.session.user});
        }
    }).sort({_id:-1});
});

router.get('/prevReport/deleteReport/:id',(req,res)=>{
    report.deleteOne({_id:req.params.id},(err,response)=>{
        if(err){
            console.log(err);
            console.log("Error deleting Report");
        }
        else{
           // console.log(response);
            console.log("Report deleted....");
            req.flash('success_msg','Report Deleted Successfully!..');
            res.send("ReportDeleted")
        }
    })
});


function ImgToBase64(file){
    return fs.readFileSync(file,'base64').toString();
}


function formatted_date()
{
   var result="";
   var d = new Date(Date.now());
   result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() + 
             " "+ d.getHours()+":"+d.getMinutes();
   return result;
}


module.exports=router;