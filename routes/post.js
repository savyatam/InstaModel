const express = require('express');
const mongoose = require('mongoose');
const router=express.Router();
const middleware=require('../middleware/tokencheck.js');
const User = mongoose.model("User");
const post=mongoose.model("Post");

router.get('/myposts',middleware,(req,res)=>{
  post.find({user:req.user._id}).
  then(files=>{res.send(files)}).catch(err=>{console.log(err);});
})

router.get('/posts',(req,res)=>{
  post.find().then(files=>{
    res.send(files);
  }).catch(err=>{console.log(err);})
});

router.post('/post',middleware,(req,res)=>{
  const {title,body}=req.body;
  if(!title||!body)
  return res.status(404).json({error:"fill all required fields"});
  req.user.password=undefined;
  const p=new post(
    {
      title,
      body,
      user:req.user
    }
  );
  p.save()
  .then(file=>{res.send(file)})
  .catch(err=>{console.log(err);});

})

module.exports=router
