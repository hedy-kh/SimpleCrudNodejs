const express = require('express');
const router = express.Router();
const User = require('../models/users');
const multer = require('multer');
const users = require('../models/users');
const fs = require('fs');


//img

var storage = multer.diskStorage({
   destination:function (req,files,cb) {
      cb(null,'./uploads')
   },
   filename:function (req,file,cb) {
      cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
     }
});




var upload = multer({
   storage:storage,

}).single('image');


   



router.post('/add',upload,function (req,res) {  
   const user = new User({
      name:req.body.name,
      cin:req.body.cin,
      image:req.file.filename,
      email:req.body.email,
      grade:req.body.grade,
      moy:req.body.score,
      phone:req.body.phone,
   });
   user.save((err)=>{
      if (err) {
         res.json({message:err.message, type : "danger"});
         
      } else {
         
         req.session.message={
           type:'success',
           message:'Student added successfully'
         }
         res.redirect("/");
      }
   });
  
});
// router.get("/",function (req,res) {  
//    res.render("/", {dep:docs})

// });
   




router.get('/', function (req,res) { 
    User.find().exec((err,users)=>{
     if (err) {
       res.json({message:err.message});
     } else {
        res.render('index',{
        title:'home page',
         users:users,
        }
        );
     }
    });
 });

 router.get("/add",function (req,res) { 
    res.render('add_users',{title:"Add users"});
  });

  router.get('/edit/:id',function (req,res) { 
   let id = req.params.id;
   User.findById(id,function(err,user){
     if (err) {
        res.redirect('/');
     } else {
       if (user===null) {
         res.redirect("/");
       }
       else{
         res.render("edit_users",{
          title:"Edit user",
          user:user,
         });
       }
     }
   });
   });

   //update user route

   router.post('/update/:id',upload,(req,res)=>{
    let id = req.params.id;
    let new_image="";
    if (req.file) {
      new_image=req.file.filename;
      try{
         fs.unlinkSync('./uploads/'+req.body.old_image);
      }catch(err){
         console.log(err);
      }
     
    } else{
         new_image =req.body.old_image;
    }
    User.findByIdAndUpdate(id,{
      name:req.body.name,
      cin:req.body.cin,
      image:new_image,
      email:req.body.email,
      grade:req.body.grade,
      moy:req.body.score,
      phone:req.body.phone,
    },(err,result)=>{
      if (err) {
         res.json({message:err.message, type:"danger"});
      }else{
         req.session.message={
            type:"success",
            message:"Student updated successfully !",
         };
         res.redirect("/");
      }
    });
   });

   router.get('/delete/:id',(req,res)=>{
      let id = req.params.id;
      User.findByIdAndRemove(id,(err,result)=>{
         if (result.image!='') {
            try {
               fs.unlinkSync('./uploads/'+result.image);
            } catch (err) {
               console.log(err);
            }
         }
         if (err) {
            res.json({message:err.message})
         }else{
            req.session.message={
               type:'info',
               message:"Student deleted successfully !"
            };
            res.redirect("/");
         }
      });
   });
 module.exports=router;