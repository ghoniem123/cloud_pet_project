const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const path = require('path');
const favicon = require('serve-favicon');

const app = express();

app.use(express.json());    
app.use(express.urlencoded({extended:false}));

app.use(cookieParser());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.use(fileUpload());

const UserRouter = require('./Routes/UserRouter');
app.use('/', UserRouter);


app.use(function(req, res, next) {
    return res.status(404).send({res });
});

app.listen(4000, ()=>console.log(`Server is running on port 4000`));





