const express = require('express');
const router = express.Router();
const firebaseapp = require('./makepPost').firebaseapp;

const db = firebaseapp.firestore();

router.post('/',(req,res)=>{
    // console.log(req.body);
    let username = req.body.email.split('@');
    username=username[0];
    // let userExists=false;    
    let uid = req.body.uid;

    // db.collection("users").doc(uid).get()
    //     .then(doc => {
    //         if (doc.exists) {
    //             console.log('Found!');
    //             userExists=true;
    //         }
    //     })
    //     .catch(err => {
    //         console.log('Error getting documents', err);
    //     });

    // if (!userExists){
        db.collection("users").doc(uid).set({
            email: req.body.email,
            username: username,
            creationTime: new Date(),
            posts:[],
            profileimage: "https://img.icons8.com/material/96/ffffff/user-male-circle--v1.png"
        })
            .then(() => {
                res.send(username);
            })
            .catch(function (error) {
                res.send("Error adding document: ", error);
            });
    // }

})

router.post('/username',(req,res)=>{
    const uid = req.body.uid;
    const username = req.body.username;
    let docId = [];
    let profileimage = []
    // console.log(req);
    db.collection("users").doc(uid).update({
        username:username
    })
        .then(() => {
            console.log("update username success!")
        })
        .catch(function (error) {
            console.log("update username error:", error)
        });
    db.collection('music-posts').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                console.log(doc.data().user.uid)
                if (doc.data().user.uid === uid) {
                    docId.push(doc.id)
                    profileimage.push(doc.data().user.profileimage)
                }
            })

        })
        .catch(err => {
            console.log(err);
        })
    setTimeout(() => {

        for (let i = 0; i < docId.length; i++) {
            db.collection("music-posts").doc(docId[i]).update({
                user: { uid: uid, profileimage: profileimage[i], username: username }
            })
                .then(() => {
                    console.log("update username in posts success!")
                })
                .catch(function (error) {
                    console.log("update username in posts error:", error)
                });
        }
    }, 1000);
})

router.post('/profileimage', (req, res) => {
    const uid = req.body.uid;
    const profileimage = req.body.profileimage;
    // console.log(uid)
    let docId=[];
    let username=[]
    // console.log(req);
    db.collection("users").doc(uid).update({
        profileimage: profileimage
    })
        .then(() => {
            console.log("update profile image success!")
        })
        .catch(function (error) {
            res.send(error)
            console.log("update profile image error:", error)
        });
    
    db.collection('music-posts').get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                console.log(doc.data().user.uid)
                if(doc.data().user.uid===uid){
                    docId.push(doc.id)
                    username.push(doc.data().user.username)
                }
            })

        })
        .catch(err => {
            console.log(err);
        })
    setTimeout(() => {

        for (let i = 0; i < docId.length;i++){
            db.collection("music-posts").doc(docId[i]).update({
                user: { uid: uid, profileimage: profileimage, username: username[i]}
            })
                .then(() => {
                    console.log("update profile image in posts success!")
                })
                .catch(function (error) {
                    console.log("update profile image in posts error:", error)
                });
        }
    }, 1000);
})

router.get('/',(req,res)=>{
    // console.log(req.query);
    const uid = req.query.query;
    // console.log(uid)
    uid !== undefined &&db.collection("users").doc(uid).get()
        .then(doc=>{
            if (doc.exists) {
                // console.log("Document data:", doc.data());
                res.send(doc.data());
            } else {
                // doc.data() will be undefined in this case
                // console.log("No such user!");
                res.send("No such user!");
            }
        })
        .catch(function (error) {
            console.log("Error getting document:", error);
            res.send(error);
        });
})

router.get('/getAllPosts', (req, res) => {
    // console.log(req.query.query);
    const uid = req.query.query;
    uid && db.collection("users").doc(uid).get()
        .then(doc => {
            if (doc.exists) {
                // console.log("Document data:", doc.data());
                res.send(doc.data().posts.reverse());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such user!");
                res.send("No such user!");
            }
        })
        .catch(function (error) {
            console.log("Error getting document:", error);
            res.send(error);
        });
})

module.exports=router;