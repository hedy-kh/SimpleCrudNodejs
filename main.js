require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');

const app =express();

const PORT= process.env.PORT||4000;
//db connection 
mongoose.connect(process.env.DB_URL, {useNewUrlParser:true},{useUnifiedTopology:true});
mongoose.set('strictQuery', true);
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', ()=>console.log("connected to database"))
//mid

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(session({
    secret:"my secret key",
    saveUninitialized:true,
    resave:false,
}));
app.use((req,res,next)=>{
  res.locals.message=req.session.message;
  delete req.session.message;
  next();
});

app.use(express.static("uploads"));
// template engine 
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
//route prfx
app.use("", require("./routes/routes"));

app.listen(PORT,()=>{console.log("server started ");})





