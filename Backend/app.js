const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const app = express();

app.use(express.json());    
app.use(express.urlencoded({extended:false}));

app.use(cookieParser());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(fileUpload());

const UserRouter = require('./Routes/UserRouter');
app.use('/', UserRouter);


app.use(function(req, res, next) {
    return res.status(404).send({res });
});

app.listen(process.env.PORT, ()=>console.log(`Server is running on port ${process.env.PORT}`));





