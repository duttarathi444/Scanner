require('dotenv/config');
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk')
const app = express();
const port =3000;
// For parsing application/json
app.use(express.json());
  
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
    region: 'ap-south-1',
    signatureVersion: 'v4',
    });

const storage = multer.memoryStorage({
    destination: function(req, file, callback){
        callback(null, '')
    }
})

const upload  = multer({storage}).single('file');
app.post('/test', (req, res) => {
  req.body; // { answer: 42 }
  res.json(req.body);
});
app.post('/createObject',(req, res)=>{
     console.log('Request Body:',JSON.stringify(req.body));
     let c_name = req.body.c_name;
     let b_name = req.body.b_name;
     let bucket_type= req.body.bucket_type;


     let bucketPath="";
     let bucketName;
    if(bucket_type==='audio'){
     bucketName =process.env.AWS_BUCKET_NAME1;
     }
     else{
      bucketName = process.env.AWS_BUCKET_NAME;
     }
    if(c_name){
       bucketPath = bucketPath+c_name+"/";
      }
    if(b_name){
      bucketPath = bucketPath+b_name+"/";
      }
    console.log("Bucket Path ===",bucketPath);
    var params = { Bucket: `${bucketName}`, Key: `${bucketPath}`, Body:'body does not matter' };

     s3.upload(params, function (err, data) {
     if (err) {
       console.log("Error creating the folder: ", err);
      res.status(500).send(err);
      } else {
      console.log("Successfully created a folder on S3");
     res.status(200).send(data);
    }
});

});

app.post('/upload_audio_v1',upload,(req, res)=>{
    console.log('/upload_audio_v1 api trigger========');
    console.log('Request=======',req);
    console.log('Request File--------',req.file);
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
          Key: `${req.file.originalname}`,
        Body: req.file.buffer
    }
    s3.upload(params, (error, data)=>{
        if(error){
            res.status(500).send(error);
        }
        res.status(200).send(data);  
     }) });  


app.post('/upload_audio',upload,(req, res)=>{
    console.log('/upload_audio api trigger========');
    console.log('Request=======',req);
    console.log('Request File--------',req.file);
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${req.query.path}${req.file.originalname}`,
        Body: req.file.buffer
    }
    s3.upload(params, (error, data)=>{
        if(error){
            res.status(500).send(error);
        }
        res.status(200).send(data);
    })
    });


app.post('/upload_video_v1',upload,(req, res)=>{
    console.log('/upload_video_v1 api trigger========');
    console.log('Request=======',req);
    console.log('Request File--------',req.file);
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME1,
          Key: `${req.file.originalname}`,
        Body: req.file.buffer
    }
    s3.upload(params, (error, data)=>{
        if(error){
            res.status(500).send(error);
        }
        res.status(200).send(data);  
     }) });


app.post('/upload_video',upload,(req,res)=>{
    console.log('/upload_video api trigger..........');
    console.log('Request..........',req);
    console.log('Request File.........',req.file);
    console.log('Request bucket path===',req.query.path);
    console.log("Complete path====",`${req.query.path}${req.file.originalname}`);
    const params = {
          Bucket: process.env.AWS_BUCKET_NAME1,
          Key: `${req.query.path}${req.file.originalname}`,
          Body: req.file.buffer
        }
       s3.upload(params, (error,data)=>{
        if(error){
       res.status(500).send(error);
       }
      res.status(200).send(data);
     })
   });

app.post('/downloadFile',(req,res)=>{
console.log("/downloadFile trigger........");
console.log("Request.......",req.body.filePath);
console.log("Request........",req.body.fileType);
getSignedUrlForDownload(req.body.filePath, req.body.fileType)
  .then((url) => {
    console.log(url);
    res.status(200).send(url);
  }).catch((e) => {
    console.log(e);
    res.status(500).send(e);
  })

});

app.listen(port, () =>{
    console.log(`Server is up at ${port}`)
});
const getSignedUrlForDownload = async (filePath, fileType) => {
  let bucketName;
  console.log("getSignedForDownload trigger.......");
  console.log("fileType========",fileType);
  console.log("filePath========",filePath); 
  if(fileType==='audio'){
    bucketName = process.env.AWS_BUCKET_NAME;
  }
  else{
   bucketName = process.env.AWS_BUCKET_NAME1;
   }
  console.log("Bucket Name======",bucketName);
  const params = {
    Bucket: `${bucketName}`,
    Key:  `${filePath}`,
    Expires: 60,
  }

  const url = await new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) reject(err)

      resolve(url)
    })
  })
 return url
}

