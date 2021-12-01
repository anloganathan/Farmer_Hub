require('dotenv').config()
const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const db=process.env.DB_URL;
const flash=require('connect-flash');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
const app=express();
app.use(express.static('public'));


const connect = mongoose
  .connect(db, { useFindAndModify: false,useUnifiedTopology:true,useNewUrlParser:true })
  .then(() => console.log("Mondo db connected...."))
  .catch((err) => console.log(err));


//ejs
app.use(expressLayouts);
app.set('view engine','ejs');

//body parsers
app.use(express.urlencoded({extended:false}));

//express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(cookieParser());
app.use(session({secret: "Your secret key"}));

//connect flash
app.use(flash());

//global vars
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.posts=req.flash('posts');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
});

//routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.use('/forum',require('./routes/forum'));


const PORT=process.env.PORT || 5000;

app.listen(PORT,console.log(`Server has started on port ${PORT}`));