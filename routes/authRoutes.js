const express    = require('express');
const router     = express.Router();
const User       = require('../models/User');
const bcrypt     = require('bcryptjs');
const bcryptSalt = 10;
const passport   = require('passport');
const flash      = require("connect-flash");
const uploadCloud = require('../config/cloudinary.js');
const nodemailer = require('nodemailer');

router.get('/apply', (req, res, next)=>{
    res.render('users/apply')
})

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

router.get("/confirm", (req, res, next)=>{
    res.render("users/confirm")
})

router.get("/signup/:id", (req, res, next)=>{
    User.findById(req.params.id)
    .then(theUser => {
        if (theUser.acceptUser === false){
            res.redirect("/apply")
        } else {
            res.render("users/signup", {theUser: theUser})
        }
    })
    .catch( err => console.log('error while rendering signup page', err))
    
})

router.post("/signup/:id", uploadCloud.single('photo'), (req, res, next)=>{
    
    const theUser = req.params.id
    const password = req.body.password

    if (username === "" || password === "") {
      req.flash('error', 'please specify a username and password to sign up')
      res.render("users/signup", { message: req.flash("error") });
      return;
      }

      User.findOne({ "email": email })
      .then(user => {
          if (user !== null) {
            res.render("users/login", { message: req.flash("error") });
        return;
        }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
          username:         req.body.username,
          password:         hashPass,
          parentName:       req.body.parentName,
          parentImage:      req.body.parentImage,
          childName:        req.body.childName,
          childImage:       req.body.childImage,
          childAge:         req.body.childAge,
          childCondition:   req.body.childCondition,
          childEye:         req.body.childEye,
          familyLocation:   req.body.familyLocation,
      })
      .then((result)=>{
          res.redirect('/');
      })
      .catch((err)=>{
        res.render("users/signup", {message: req.flash("error") });
      })
      })
      .catch(error => {
        next(error)
      })
    });

router.get('/login', (req, res, next)=>{
    
    res.render('users/login', {message: req.flash('error')})
  })

router.post('/login', passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  successFlash: true,
  passReqToCallback: true
}));

router.get("/logout", (req, res, next) => {
    req.logout();
    res.redirect('/');
    
  });

module.exports = router;
