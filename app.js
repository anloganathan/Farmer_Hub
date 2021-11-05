require('dotenv').config()
const express=require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose=require('mongoose');
const db=process.env.DB_URL;
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');

const app=express();
app.use(express.static('public'));
//passport config
require('./config/passport')(passport);

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

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global vars
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
});

//routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
app.use('/forum',require('./routes/forum'));
app.use('/blogs',require('./routes/blog'));


const PORT=process.env.PORT || 5000;

app.listen(PORT,console.log(`Server has started on port ${PORT}`));