const express = require('express');
const mongoose = require('mongoose');
const router=express.Router();
const middleware=require('../middleware/tokencheck.js');
const GridFsStorage = require("multer-gridfs-storage");
const crypto = require("crypto");
const multer = require("multer");
const Grid = require("gridfs-stream");
const mongoURI="mongodb+srv://shobha_99:WECuWQlF0UKDYxTD@cluster0-z6lhf.mongodb.net/test?retryWrites=true&w=majority"
let gfs;
const conn = mongoose.createConnection(mongoURI);

const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })



conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
  console.log("Connection Successful");
});
mongoose.Promise = global.Promise;


const storage = new GridFsStorage({
  url: mongoURI,
  file: (req,file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  }
});




const upload = multer({ storage });

router.post("/upload",upload.single("customFile"),(req, res, err) => {
  res.send(req.file);
  console.log(req.file);
});


router.get('/imageByfilename/:filename', (req, res) => {
  gfs.files.findOne({filename: req.params.filename }, (err, file) => {

    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {

      const readstream = gfs.createReadStream(file.filename);
      //console.log(res);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});


router.get('/imageByid/:id', (req, res) => {
  var id = mongoose.Types.ObjectId(req.params.id);
  gfs.files.findOne({_id:id}, (err, file) => {

    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {

      const readstream = gfs.createReadStream(file.filename);
      //console.log(res);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});
module.exports=router
