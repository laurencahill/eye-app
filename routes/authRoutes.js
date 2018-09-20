const express    = require('express');
const router     = express.Router();
const User       = require('../models/User');
const bcrypt     = require('bcryptjs');
const bcryptSalt = 10;
const passport   = require('passport');
const flash      = require("connect-flash");
const uploadCloud = require('../config/cloudinary.js');
const multer     = require('multer');
const nodemailer = require('nodemailer');

//user sees application page
router.get('/apply', (req, res, next)=>{
    res.render('users/apply')
})


//user fills out application, nodemailer sends email to inbox
router.post('/apply', (req, res, next)=>{
    
    let { parentName, emailAddress, childName, childCondition, parentReason } = req.body;

    const email = req.body.emailAddress

    if (email === "") {
      req.flash('error', 'please specify an email address to apply')
      res.render("users/apply", { message: req.flash("error") });
      return;
      }
      User.create({
        parentName:       req.body.parentName,
        emailAddress:     req.body.emailAddress,
        childName:        req.body.childName,
        childCondition:   req.body.childCondition,
        parentReason:     req.body.parentReason,
        
    })
    .then((result)=>{
        console.log('what is result: ', result)
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'just.for.tests.3142@gmail.com',
              pass: 'JustForTests1' 
            }
          })
          console.log('what is trasporter: ', transporter)
          transporter.sendMail({
            from: 'Eye App',
            to: 'just.for.tests.3142@gmail.com', 
            subject: 'Application from Eye App', 
            text: 'message',
            html: `<b>${result}</b>`,
          })
        .then(info => {
            res.redirect('/confirm')
        })  
        .catch(error => console.log("err while sending email: ",error)) 
    })
    .catch((err)=>{
      res.render("users/confirm", {message: req.flash("error") });
    })
});

//user gets confirm page
router.get("/confirm", (req, res, next)=>{
    res.render("users/confirm")
})

//if approved (boolean), user is sent link to complete signup.
router.get("/signup/:id", (req, res, next)=>{
    User.findById(req.params.id)
    .then(theUser => {
        console.log('hello: ', theUser)
        if (theUser.acceptUser === false){
            res.redirect("/apply")
        } else {
            res.render("users/signup", {theUser: theUser})
        }
    })
    .catch( err => console.log('error while rendering signup page', err))   
})

router.post("/signup/:id", uploadCloud.array('photo', 2), (req, res, next)=>{
    const theUser = req.params.id
    const username = req.body.username
    const password = req.body.password


    if (username === "" || password === "") {
      req.flash('error', 'please specify a username and password to sign up')
      res.render("users/signup", { message: req.flash("error") });
      return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      console.log(bcryptSalt, salt, hashPass)

      User.findByIdAndUpdate (theUser, {$set:{
          username:         req.body.username,
          password:         hashPass,
          parentName:       req.body.parentName,
        //   parentImage:      req.file.url,
          childName:        req.body.childName,
        //   childImage:       req.file.url,
          childAge:         req.body.childAge,
          childCondition:   req.body.childCondition,
          childEye:         req.body.childEye,
          familyLocation:   req.body.familyLocation,}
      })
      .then((result)=>{
          res.redirect('/');
      })
      .catch((err)=>{
        res.render("users/signup", {message: req.flash("error") });
      })
})

router.get('/login', (req, res, next)=>{
    res.render('users/login', {message: req.flash('error')})
  })

router.post('/login', (req, res, next)=>{
    passport.authenticate('local', (err, user, failureData) => {
        if(err){
        }
        if(!user){
        }
        req.login(user, (err) => {
        res.redirect('/users')
        })
        }) (req,res,next)
        });
    
    router.get("/logout", (req, res, next) => {
        req.logout();
        res.redirect('/');
        
    });
    
module.exports = router;
    