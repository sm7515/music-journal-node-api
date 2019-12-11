const express = require('express');
const router = express.Router();
const firebaseapp = require('./makepPost').firebaseapp;

const db = firebaseapp.firestore();

router.get('/',(req,res)=>{
    let data=[];
    db.collection('music-posts').orderBy('postDate', "desc").get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                data.push(doc.data());
            })
            res.send(data);
        })
        .catch(err=>{
            console.log(err);
            res.send(err);
        })
})

module.exports = router;