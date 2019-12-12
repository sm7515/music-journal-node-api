const express = require('express');
const router = express.Router();
const firebaseapp = require('./makepPost').firebaseapp;
const firebase = require('./makepPost').firebase;

const db = firebaseapp.firestore();

router.post('/', (req, res) => {
    console.log(req.body)
    const uid = req.body.uid;
    const trackId = req.body.trackId.toString(10);
    const comment = req.body.comment;

    db.collection("music-posts").doc(trackId).update({
        comments: firebase.firestore.FieldValue.arrayUnion(comment)
    })
        .then(() => {
            console.log("update track comments success!")
        })
        .catch(function (error) {
            console.log("update track comments error:", error)
        });

    let posts = [];
    db.collection("users").doc(uid).get()
        .then(doc => {
            posts = doc.data().posts;
            for (let i = 0; i < posts.length; i++) {
                if (posts[i].track.id == trackId) {
                    posts[i].comments.push(comment);
                }
            }
        })

    setTimeout(() => {
        db.collection("users").doc(uid).update({
            posts: posts
        })
            .then(() => {
                console.log("update user post comments success!")
                res.send("success")
            })
            .catch(function (error) {
                console.log("update user post comments error:", error)
            });
    }, 200);
})

module.exports = router;