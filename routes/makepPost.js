const express = require('express');
const router = express.Router();

const firebase = require('firebase');
const firebaseConfig = {
    apiKey: "AIzaSyDVkoaIkaTNQ2Cc1BRppDNoZXwqmZ4lKSY",
    authDomain: "final-proj-cb8cf.firebaseapp.com",
    databaseURL: "https://final-proj-cb8cf.firebaseio.com",
    projectId: "final-proj-cb8cf",
    storageBucket: "final-proj-cb8cf.appspot.com",
    messagingSenderId: "397252492401",
    appId: "1:397252492401:web:c314ce3bf303e65874afd0",
    measurementId: "G-ELC9RPNL7X"
};
const firebaseapp = firebase.initializeApp(firebaseConfig);
const db = firebaseapp.firestore();
let admin = require('firebase-admin');

router.post('/', (req, res) => {
    const date = new Date();
    // console.log(req.body);
    const uid=req.body.user.uid;
    const userEmail=req.body.user.email;
    let userName="";
    const postContent=req.body.postContent;
    const track=req.body.track;
    let profileimage="";

    db.collection('users').doc(uid).get()
        .then(doc => {
            if (doc.exists) {
                // console.log("Document data:", doc.data());
                profileimage = doc.data().profileimage;
                userName=doc.data().username;
                // console.log(profileimage)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
        .catch(err=>{
            console.log(err)
        })
    
    setTimeout(() => {
        db.collection("music-posts").doc(track.id.toString(10)).set({
            user: { uid:uid,email: userEmail, username: userName, profileimage: profileimage },
            postContent: postContent,
            track: track,
            postDate: date,
            likes:0,
            comments:[]
        })
            .then(() => {
                console.log("post success!")
                res.status(200).send("success");
            })
            .catch(function (error) {
                console.log("post error:", error)
                res.send("Error adding document: ", error);
            });
    }, 500);
    let newPost={
        postContent: postContent,
        track: track,
        postDate: date,
        likes:0,
        comments:[]
    }
    let allPosts=[];
    db.collection("users").doc(uid).get()
        .then(doc => {
            allPosts=doc.data().posts;
            allPosts.push(newPost);
        })
    
    setTimeout(() => {
        db.collection("users").doc(uid).update({
            posts: allPosts
        })
            .then(() => {
                console.log(allPosts.length)
                console.log("update user post success!")
            })
            .catch(function (error) {
                console.log("update user post error:", error)
            });
    }, 500);

});

module.exports = router;
module.exports.firebaseapp = firebaseapp;
module.exports.firebase = firebase;