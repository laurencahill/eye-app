const express   = require('express');
const router    = express.Router();
const Story     = require('../models/Story');

//get stories dashboard
router.get('/stories', (req, res, next) => {
    if (!req.user) {
        res.redirect("/login")
    } else {
        Story.find()
        .then((listOfStories) => {
            res.render('stories/index', { theStoryList: listOfStories })
        })
        .catch((err) => {
            next(err);
        })
    }
})

//create the user story
router.get('/stories/create', (req, res, next) => {
    if (!req.user) {
        res.redirect("/login")
    } else {
        res.render('stories/create');
    }
})

//post the user story
router.post('/stories/create', (req, res, next) => {
    Story.create({
        question1: req.body.question1,
        question2: req.body.question2,
        question3: req.body.question4,
        question4: req.body.question4,
        question5: req.body.question5,
        question6: req.body.question6,
        question7: req.body.question7,
        question8: req.body.question8,
        question9: req.body.question9,
        question10: req.body.question10,
    })
    .then((response) => {
        res.redirect('/stories/show')
    })
    .catch((err) => {
        next(err);
    })
})

//delete the user story
router.post("/stories/delete/:id", (req, res, next) => {  
    Story.findByIdAndRemove(req.params.id)
    .then((response) => {
        res.redirect("/users/index")
    })
    .catch((err) => {
        next(err);
    })
})

//edit the user story
router.get("/stories/edit/:id", (req, res, next) => {
    if (!req.user) {
        res.redirect("/login")
    } else {
        Story.findById(req.params.id)
        .then((theStory) => {
            res.render('stories/edit', { story: theStory })
        })
        .catch((err) => {
            next(err);
        })
    }
})

//post the edited user story 
router.post("/stories/update/:id", (req, res, next) => {
    Story.findByIdAndUpdate(req.params.id, {
        question1: req.body.question1,
        question2: req.body.question2,
        question3: req.body.question4,
        question4: req.body.question4,
        question5: req.body.question5,
        question6: req.body.question6,
        question7: req.body.question7,
        question8: req.body.question8,
        question9: req.body.question9,
        question10: req.body.question10,
    })
    .then((response) => {
        res.redirect('/stories/show' + req.params.id)
    })
    .catch((err) => {
        next(err);
    })
})

//view a user story by ID
router.get('/stories/:id', (req, res, next) => {
    if (!req.user) {
        res.redirect("/login")
    } else {
        Story.findById(req.params.id)
        .then((theStory) => {
            res.render('stories/show', { story: theStory })
        })
        .catch((err) => {
            next(err);
        })
    }
})

module.exports = router;