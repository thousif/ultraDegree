var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
var Course = require('./Course');
var CourseChapters = require('./courseChapters');

router.get('/list', /* VerifyToken, */ function (req, res) {
    console.log('fetching all courses from db');
    Course.find({},function (err, course) {
        if (err) return res.status(500).send("There was a problem fetching the courses.");
        res.status(200).send(course);
    });
});

router.get('/:id', function (req, res) {
    Course.findById(req.params.id, function (err, course) {
        if (err) return res.status(500).send("Please try again Later.");
        if (!course) return res.status(400).send("No such course exists.");
        CourseChapters.find({cid : course._id, act : true},function(err,courseChapters){
            if(err) return res.status(500).send('Please try again later.');
            // console.log(courseChapters);
            // course.curriculum =  courseChapters;
            console.log(course);
            res.status(200).send({
                data : {
                    basic : course,
                    curriculum : courseChapters
                }
            });
        })
    });
});

module.exports = router;