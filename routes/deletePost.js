const express = require('express');
const router = express.Router();
const firebaseapp = require('./makepPost').firebaseapp;

const db = firebaseapp.firestore();

router.post('/', (req, res) => {
    let posts = [];
    let newPosts=[];
    console.log(req.body);
    let uid=req.body.uid;
    let trackid = req.body.trackId.toString(10);
    db.collection('music-posts').doc(trackid).delete();
    db.collection('users').doc(uid).get()
        .then(doc=>{
            posts=doc.data().posts;
            for (let i = 0; i < posts.length; i++) {
                if (posts[i].track.id != trackid) {
                    newPosts.push(posts[i])
                }
            }
        })
    setTimeout(() => {
        db.collection('users').doc(uid).update({
            posts:newPosts
        }).then(()=>{
            res.send("success")
            console.log("delete user post success!")
        }).catch(err=>{
            console.log("delete user post error!")
        })
        // console.log(newPosts)
    }, 500);
})

module.exports = router;