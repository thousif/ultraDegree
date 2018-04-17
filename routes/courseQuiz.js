var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var VerifyToken = require('../auth/VerifyToken');
var Course = require('../models/course');
var CourseQuiz = require('../models/courseQuiz');

router.get('/list', VerifyToken, function (req, res) {
    CourseQuiz.find({},function (err, quizes) {
        if (err) return res.status(500).send("There was a problem fetching the quizes.");
        res.status(200).send(quizes);
    });
});

router.post('/add', VerifyToken, function(req,res) {

    req.checkBody('nm').notEmpty();
    req.checkBody('desc').notEmpty();
    req.checkBody('cid').notEmpty().isValidMongoId();

    if(req.validationErrors()){ 
        res.status(400).send("Invalid parameters");
        return 
    }

    var newQuiz = new CourseQuiz({
        nm   : req.body.nm,
        dsc  : req.body.desc,
        cid  : req.body.cid,
        act  : true,
        tim  : new Date().getTime()
    })
    newQuiz.save(function(err,quiz){
        console.log(err);
        if(err) return res.status(500).send("There was a problem adding the quiz");
        res.status(200).send(quiz);
    })
})

module.exports = router;