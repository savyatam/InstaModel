const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const JWT_SECRET="you";
const User = mongoose.model("User");

const middleware=require('../middleware/tokencheck.js');
router.get('/',middleware,(req,res)=>{
  res.send('works');
});

router.post('/signup',(req,res)=>{
  const {name,email,password}= req.body;
  if(!name||!password||!email)
  return res.status(404).json({error:"Fill all required details"});
  User.findOne({email:email}).
  then((file)=>{
  if(file)
  return res.status(404).json({error:"EmailId exits"});

  bcryptjs.hash(password,12).then((newpassword)=>{
           const p={
             name:name,
             email:email,
             password:newpassword
                    };
             User.create(p).then((file)=>
            {console.log(file);}).catch(err=>{console.log(err);});
            res.send('saved');}).catch(err=>{console.log(err);});


}).catch(err=>{console.log(err);});

});


router.post('/signin',(req,res)=>{
 const {email,password}=req.body;
  if(!email||!password)
  return res.status(404).json({error:"fill all required details"});
  User.findOne({email:email}).
  then(file=>{
    if(!file)
    return res.send('No registered emailId found');
    bcryptjs.compare(password,file.password).then(exists=>{
      if(!exists)
      return res.send("Wrong password");
      const token=jsonwebtoken.sign({_id:file._id},JWT_SECRET);
      res.json({token});
    }).catch(err=>{console.log(err);})
  })
  .catch(err=>{console.log(err);})


});



module.exports =router;
