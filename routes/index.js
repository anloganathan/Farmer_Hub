const express=require('express');
const router=express.Router();
const {ensureAuthenticated}=require('../config/auth');
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

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        name:req.user.name,
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
            time:formatted_date()
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
            name:req.user.name,
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

router.get('/prevReport',(req,res)=>{
    report.find({}, (err, items) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(items);
        }
    });
})

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