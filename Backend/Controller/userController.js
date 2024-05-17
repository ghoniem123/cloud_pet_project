require('dotenv').config();
const { DynamoDBClient, GetItemCommand, PutItemCommand, DeleteItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, PutBucketVersioningCommand } = require("@aws-sdk/client-s3");
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner');
const c = require('config');
const multer = require('multer');
const upload = multer();


const DbClient = new DynamoDBClient({
  region : process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },  

})

const userTable = "Users";

const s3Client = new S3Client({
  region : process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },  
})

const bucketName = "photos-bucket-cloud";

// const enableBucketVersioning = async () => {
//   const params = {
//     Bucket: bucketName,
//     VersioningConfiguration: {
//       Status: 'Enabled',
//     },
//   };

//   try {
//     const data = await s3Client.send(new PutBucketVersioningCommand(params));
//     console.log('Bucket versioning enabled');
//   } catch (err) {
//     console.log('Error enabling bucket versioning', err);
//   }
// };

// enableBucketVersioning(); //to enable versioning for the bucket

const userController = {

   

  Login: async (req, res) => {
    console.log(req.params)
    const {username} = req.params;

    console.log(username)

    const DBparams = {
      TableName: userTable,
      Key: {
          'username':{S:username }, //to return the record with username 
      },
    };

    try{

      const {Item: userData} = await DbClient.send(new GetItemCommand(DBparams));

      console.log(userData);

      if(!userData)
        return res.status(401).send({msg: "Invalid username! please try again"});
      

      const s3params ={
        Bucket: bucketName,
        Key: `${username}-photo`,
      };

      const {Body: photo} = await s3Client.send(new GetObjectCommand(s3params));
      console.log(photo)
      userData.photo = photo.transformToString('base64');

      const user = {
        username : userData.username.S,
        name: userData.name.S,
        age: userData.age.N,
        photo:`${username}-photo`,
      };

      return res.status(200).send({data: user});

    }catch(err){
      console.log(err);
      return res.status(401).send({msg: "Invalid username! please try again"});
    }
 
  },

  Register: async (req, res) => {
    let {username, name, age} = req.body;

    const Dbparams = {
      TableName: userTable,
      Key: {
        'username':{S:username}, //to return the record with username 
      },
    };
    
    try{

      const {Item: userData} = await DbClient.send(new GetItemCommand(Dbparams));

      if(userData)
        return res.status(401).send({msg: "Username already exists! please try again"});

      const s3params ={
        Bucket: bucketName,
        Key: `${username}-photo`,
        Body: req.files.photo.data,
      };

     await s3Client.send( new PutObjectCommand(s3params));



      const DbPutparams ={
        TableName: userTable,
        Item: {
          'username': {S: username},
          'name': {S: name},
          'age': {N: age},
          'photo': {S: `${username}-photo`},
        },
      }

      await DbClient.send(new PutItemCommand(DbPutparams));
      const user = {
        username,
        name,
        age,
        photo:`${username}-photo`,
      };
      return res.status(200).send({data: user});

    }catch(err){
      console.log(err);
      return res.status(500).send({err});
    }

},

  deleteUser: async (req, res) =>{
    const {username} = req.params;

    const Dbparams = {
      TableName: userTable,
      Key:{
        'username':{S:username},
      }
    }

    console.log(username)

   try{
    await DbClient.send(new DeleteItemCommand(Dbparams));

    const s3params = {
      Bucket: bucketName,
      Key: `${username}-photo`,
    }

    await s3Client.send(new DeleteObjectCommand(s3params));

    return res.status(200).send({msg: 'User deleted successfully'});


   }catch(err){
    console.log(err)
    return res.status(500).send({err});
   }

  },

  updatePhoto : async (req, res)=>{
      const {username} = req.body;

      console.log(req.files);

      const s3params ={
        Bucket: bucketName,
        Key: `${username}-photo`,
        Body: req.files.photo.data,
      }

      try{

        await s3Client.send(new PutObjectCommand(s3params));
        return res.status(200).send({msg: 'Photo updated successfully'});

      }catch(err){
        return res.status(500).send({err});
      }
  },

  updateName: async (req, res) =>{
    const {username, name} = req.body;

    const Dbparams = {
      TableName: userTable,
      Key:{
        'username' :{S:username},
      },
      UpdateExpression: 'set #n = :n',
      ExpressionAttributeNames: {
        '#n': 'name',
      },
      ExpressionAttributeValues: {
        ':n':{S:name},
      },
      ReturnValues: "ALL_NEW"
    }

    try{

      const data = await DbClient.send(new UpdateItemCommand(Dbparams));

      console.log(data.Attributes);
      const user = {
        username : data.Attributes.username.S,
        name: data.Attributes.name.S,
        age: data.Attributes.age.N,
        photo:`${username}-photo`,
      };
      return res.status(200).send({data: user});

    }catch(err){
      console.log(err)
      return res.status(500).send({err});
    }
  },

  updateAge: async (req, res) =>{
    const {username, age} = req.body;

    const Dbparams = {
      TableName: userTable,
      Key: {
        'username':{S:username},
      },
      UpdateExpression: 'set #a = :a', //u can directly update the column with using ExpressionAttributeNames but it is a good practice to use it
      ExpressionAttributeNames: {
        '#a': 'age',
      },
      ExpressionAttributeValues: {
        ':a': {N:String(age)},
      },
      ReturnValues: "ALL_NEW"

    };


    try{

      const data = await DbClient.send(new UpdateItemCommand(Dbparams));
      console.log(data.Attributes);
      const user = {
        username : data.Attributes.username.S,
        name: data.Attributes.name.S,
        age: data.Attributes.age.N,
        photo:`${username}-photo`,
      };
      return res.status(200).send({data: user});
    }catch(err){
      console.log(err);
      return res.status(500).send({err});
    }


  },

  displayImage: async (req, res) =>{

    const {imageKey} = req.params;

    console.log(imageKey);
    const params = {
      Bucket: bucketName,
      Key: imageKey,
    };

    try {

      const url = await getSignedUrl(s3Client, new GetObjectCommand(params), { expiresIn: 3600 });
      console.log(url);

      return res.status(200).send({url: url});

    } catch (err) {
      console.log(err);

      return res.status(500).send({err});
    }
  }
  

}

module.exports= userController;