const mongoose = require('mongoose');
const User= mongoose.model("User")
const jsonwebtoken = require('jsonwebtoken');
const JWT_SECRET="you";
module.exports=(req,res,next)=>{
  const token=req.headers.auth;
  if(!token)
  return res.status(401).json({error:"login"});
  jsonwebtoken.verify(token,JWT_SECRET,(err,decode)=>{
    if(err)
    return res.status(401).json({error:"login"});
    User.findOne({_id:decode}).then(file=>{
      console.log(file);
      req.user=file;
      next();
    })
    .catch(err=>{console.log(err);})
    //next();
  })
}
