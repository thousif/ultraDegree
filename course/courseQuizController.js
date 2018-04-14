var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Course = require('./Course');
var CourseQuiz = require('./CourseQuiz');

router.get('/list', /* VerifyToken, */ function (req, res) {
    console.log('fetching all quizes from db');
    CourseQuiz.find({},function (err, quizes) {
        if (err) return res.status(500).send("There was a problem fetching the quizes.");
        res.status(200).send(quizes);
    });
});

router.post('/add', function(req,res) {
    console.log('adding course');
    console.log(req.body);
    if(!req.body.nm) return res.status(400).send('Invalid Parameters');
    if(!req.body.desc) return res.status(400).send('Invalid Parameters');
    if(!req.body.cid) return res.status(400).send('Invalid Parameters');
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