const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = process.env.PORT || 4000;
const searchRoute =require('./routes/search')
const makePostRoute = require('./routes/makepPost')
const getPostRoute = require('./routes/getPost')
const userRoute =require('./routes/user')
const deletePostRoute=require('./routes/deletePost')
const addLikeRoute=require('./routes/addLike')

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use("/search",searchRoute);
app.use("/makepost", makePostRoute);
app.use("/getpost", getPostRoute);
app.use("/user",userRoute);
app.use("/deletePost", deletePostRoute);
app.use("/addLike", addLikeRoute);

app.listen(port, () => {
    console.log(`server running on ${port}`);
})