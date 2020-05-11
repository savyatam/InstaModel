const express = require('express');
const PORT=process.env.PORT || 4000;

const app=express();
const mongoose = require('mongoose');
//WECuWQlF0UKDYxTD
const key="mongodb+srv://shobha_99:WECuWQlF0UKDYxTD@cluster0-z6lhf.mongodb.net/test?retryWrites=true&w=majority"

require('./models/user.js');
require('./models/post.js');
app.use(express.json());
app.use(require('./routes/auth.js'));
app.use(require('./routes/post.js'));

mongoose.connect(key,{
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on('connected',()=>{
  console.log('connected');
})
mongoose.connection.on('error',()=>{
  console.log('error');
})



app.get('/',(req,res)=>{
  res.send('hello');
});

app.listen(PORT,()=>{
  console.log('listening');
});
