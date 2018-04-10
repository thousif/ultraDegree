var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
var Course = require('./Course');

// UPDATES A SINGLE USER IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
router.get('/list', /* VerifyToken, */ function (req, res) {
    console.log('fetching all courses from db');
    Course.find({},function (err, course) {
        console.log(err,course);
        if (err) return res.status(500).send("There was a problem fetching the courses.");
        res.status(200).send(course);
    });
});

module.exports = router;