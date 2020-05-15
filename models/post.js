const mongoose =require('mongoose');
const {ObjectId}= mongoose.Schema.Types;
const postSchema=new mongoose.Schema(
  {
    title:{type:String,required:true},
    image:{type:String,default:"noo"},
    user:{type:ObjectId,ref:"User"},
    likes:[{type:ObjectId,ref:"User"}],
    comments:
    [{text:String,
      user:{type:ObjectId,ref:"User"}   }]
  }
)
mongoose.model("Post",postSchema);
