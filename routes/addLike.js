const express = require('express');
const router = express.Router();
const firebaseapp = require('./makepPost').firebaseapp;
const firebase=require('./makepPost').firebase;

const db = firebaseapp.firestore();

router.post('/', (req, res) => {
    console.log(req.body)
    const uid = req.body.uid;
    const trackId=req.body.trackId.toString(10);

    db.collection("music-posts").doc(trackId).update({
        likes: firebase.firestore.FieldValue.increment(1)
    })
        .then(() => {
            console.log("update track likes success!")
        })
        .catch(function (error) {
            console.log("update track likes error:", error)
        });

    let posts=[];
    db.collection("users").doc(uid).get()
        .then(doc=>{
            posts=doc.data().posts;
            for(let i=0;i<posts.length;i++){
                if (posts[i].track.id == trackId){
                    posts[i].likes += 1;
                }
            }
        })

    setTimeout(() => {
        db.collection("users").doc(uid).update({
            posts: posts
        })
            .then(() => {
                console.log("update user post likes success!")
                res.send("success")
            })
            .catch(function (error) {
                console.log("update user post likes error:", error)
            });
    }, 500);
})

module.exports = router;