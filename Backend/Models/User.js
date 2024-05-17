// const AWS = require ('aws-sdk');
// require('dotenv').config();

// AWS.config.update({
//     region: 'eu-north-1',
//     accessKeyId:process.env.Access_key_ID,
//     secretAccessKey:process.env.Secret_access_key,
// });

// const DB = new AWS.DynamoDB();
// // and use AWS.DynamoDB.DocumentClient() to interact with the database
// //in the controller file

// const userSchema = {
//     TableName: 'Users',
//     KeySchema: [
//         {AttributeName: 'username', KeyType: 'HASH'} //the primary key of the table
//     ],
//     AttributeDefinitions: [
//         {AttributeName: 'username', AttributeType: 'S'}, // S for string, N for number
//         {AttributeName: 'name', AttributeType: 'S'},
//         {AttributeName: 'age', AttributeType: 'N'},
//         {AttributeName: 'photo', AttributeType: 'S'}, //store the object id of the s3 object to be retrieved using it easily
//     ],
// };

// DB.describeTable({TableName: 'Users'}, (err, data) => {
//     if (err && err.code === 'ResourceNotFoundException') {
//         DB.createTable(userSchema, (err, data) => {
//             if (err) {
//                 console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
//             } else {
//                 console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
//             }
//         });
//     } else if (err) {
//         console.error('Unable to describe table. Error JSON:', JSON.stringify(err, null, 2));
//     } else {
//         console.log('Table already exists. Table description JSON:', JSON.stringify(data, null, 2));
//     }
// });

// //json.stringify is used to convert the json object to a string to be printed to the console and readable 
// // null used to include all arguments and 2 to include indentation

// //will set in the package.json to node User.js to runt this file each time before running the server to make sure that the table exists
// //and if not it will create it