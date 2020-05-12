const express = require('express');
const PORT=process.env.PORT || 4000;
var cors = require('cors')
const app=express();
app.use(cors())
const mongoose = require('mongoose');
//WECuWQlF0UKDYxTD
const key="mongodb+srv://shobha_99:WECuWQlF0UKDYxTD@cluster0-z6lhf.mongodb.net/test?retryWrites=true&w=majority"
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
require('./models/user.js');
require('./models/post.js');
app.use(express.json());
app.use(require('./routes/auth.js'));
app.use(require('./routes/post.js'));





app.get('/',(req,res)=>{
  res.send('hello');
});

app.listen(PORT,()=>{
  console.log('listening');
});
