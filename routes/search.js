const express = require('express');
const router = express.Router();
const request =require('request');

router.get("/",(req,res)=>{
    // console.log(req.query);
    let queryStr = req.query.query;
    request(`https://api.deezer.com/search?q=${queryStr}&order=RANKING&limit=1`, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        if(error)
            res.status(404).send("Sorry, we didn't find the song you're looking for.");        
        else{
            // console.log(body)
            res.send(body);
        }
    });
})

router.get("/random", (req, res) => {
    console.log(req.query);
    let queryStr = req.query.query;
    request(`https://api.deezer.com/track/${queryStr}`, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        if (error)
            res.status(404).send("Sorry, we didn't find the song you're looking for.");
        else{
            // console.log(body)
            res.send(body);
        }
    });
})

module.exports = router;