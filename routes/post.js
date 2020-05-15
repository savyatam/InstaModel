const express = require('express');
const mongoose = require('mongoose');
const router=express.Router();
const middleware=require('../middleware/tokencheck.js');
const User = mongoose.model("User");
const post=mongoose.model("Post");

router.get('/myposts',middleware,(req,res)=>{
  post.find({user:req.user._id}).
  populate("user","image").
  then(files=>{
    if(files.length)
    res.send(files)
    else
    res.send(req.user);
  }).catch(err=>{console.log(err);});
})

router.get('/othersPosts/:id',middleware,(req,res)=>{
  post.find({user:req.params.id}).
  populate("user","image").
  then(files=>{
    if(files.length)
    res.send(files)
    else
    res.send(req.user);
  }).catch(err=>{console.log(err);});
})



router.get('/posts',middleware,(req,res)=>{
  post.find().populate("user","_id name")
  .populate("comments.user","_id name")
  .then(files=>{
    res.send(files);
  }).catch(err=>{console.log(err);})
});

router.post('/post',middleware,(req,res)=>{
  const {title,image}=req.body;
  if(!title)
  return res.status(404).json({error:"fill all required fields"});
  req.user.password=undefined;
  const p=new post(
    {
      title,
      image,
      user:req.user
    }
  );
  p.save()
  .then(file=>{res.send(file)})
  .catch(err=>{console.log(err);});

})


router.put('/like',middleware,(req,res)=>{
  post.findByIdAndUpdate(req.body.postId,{
    $push:{likes:req.user._id}
  },{
    new:true
  }).exec((err,result)=>{
    if(err){
      return res.status(444).json({error:err});
    }else
    res.send(result);
  })

})

router.put('/unlike',middleware,(req,res)=>{
  post.findByIdAndUpdate(req.body.postId,{
    $pull:{likes:req.user._id}
  },{
    new:true
  }).exec((err,result)=>{
    if(err){
      return res.status(444).json({error:err});
    }else
    res.send(result);
  })

})

router.put('/comment',middleware,(req,res)=>{
  const comments={text:req.body.text,user:req.user};
  post.findByIdAndUpdate(req.body.postId,{
    $push:{comments:comments}
  },{
    new:true
  }).populate("comments.user","_id name").exec((err,result)=>{
    if(err){
      return res.status(444).json({error:err});
    }else
    res.send(result);
  })

})

router.put('/deletepost',middleware,(req,res)=>{
  post.findById(req.body.postId)
  .populate("user","_id")
  .exec((err,result)=>{
    if(err){
      return res.status(444).json({error:err});
    }else
      {
        if(result)
        {
        const searchid=result.user._id;
        const foundid=req.user._id;
        console.log(searchid.toString(),"and",foundid.toString());
        if(searchid.toString()===foundid.toString())
        {res.send(result);result.remove();}
        else
          res.send('NO_ACCESS');

      }

      }
  })

})



module.exports=router
