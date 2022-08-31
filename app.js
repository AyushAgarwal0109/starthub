const express = require('express');
require('dotenv').config();
const app = express();
const cookieParser = require('cookie-parser');

//regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookies and file middleware
app.use(cookieParser());

//import all routes here

//router middleware

// export app js
module.exports = app;
