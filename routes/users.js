const express    = require('express');
const router     = express.Router();
const User       = require('../models/User');
const uploadCloud = require('../config/cloudinary.js');
const multer    = require('multer');


//show the user dashboard page
router.get('/users', (req, res, next)=>{
    User.findById(req.user._id)
    .then((userInfo) => {
        res.render('users/index', { theUser: userInfo })
    })
    .catch((err) => {
        next(err);
    })
})


//show the user account page
router.get('/users/account', (req, res, next)=>{
        User.findById(req.user._id)
        .then((userInfo) => {
            res.render('users/account', { theUser: userInfo })
        })
        .catch((err) => {
            next(err);
        })
    
})

//edit the user account info
router.get("/users/edit/:id", (req, res, next) => {
    if (!req.user) {
        res.redirect("/login")
    } else {
        User.findById(req.params.id)
        .then((userInfo) => {
            res.render('users/edit', { theUser: userInfo })
        })
        .catch((err) => {
            next(err);
        })
    }
})

//post the edited user account info 
router.post("/users/parent/update/:id", uploadCloud.single('photo'), (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, {
        parentImage:    req.file.url,
        parentName:     req.body.parentName,
        familyLocation: req.body.familyLocation,
        username:       req.body.username,
        password:       req.body.password,
    })
    .then((response) => {
        // res.redirect('/users/account')
    })
    .catch((err) => {
        next(err);
    })
})

//post the edited user account info 
router.post("/users/child/update/:id", uploadCloud.single('photo'), (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, {
        childImage:     req.file.childImage,
        childName:      req.body.childName,
        childAge:       req.body.childAge,
        childCondition: req.body.childCondition,
        childEye:       req.body.childEye,
    })
    .then((response) => {
        // res.redirect('/users/account')
    })
    .catch((err) => {
        next(err);
    })
})

//delete the user account
router.post("/users/delete/:id", (req, res, next) => {  
    User.findByIdAndRemove(req.params.id)
    .then((response) => {
        res.redirect("/")
    })
    .catch((err) => {
        next(err);
    })
})

module.exports = router;
