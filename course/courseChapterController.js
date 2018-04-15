var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var CourseChapter = require('./courseChapters');
var CourseQuiz = require('./CourseQuiz');
var CourseLecture = require('./courseLecture');

function findChapterSequence(course_id, cb){
  console.log(course_id);
  CourseChapter.findOne({
    course_id : course_id,
    act       : true
  },{
    seq : 1
  },{
    sort : {
      seq : -1
    }
  },function(err,chapter){
    if(err){
      return cb(err,null);
    }
    if(!chapter || !chapter.seq){
      return cb(null,1);
    }
    return cb(null,chapter.seq+1);
  });
}

router.post('/add', /* VerifyToken, */ function (req, res) {

    console.log(req.body);
    findChapterSequence(req.body.cid, function(err,seq){
        if(err){
            console.trace(err);
            return res.status(500).send("Server error");
        }

        var new_chapter = new CourseChapter({
            nm  : req.body.name,
            dsc : req.body.dsc,
            cid : req.body.cid,
            seq : seq,
            act : true,
            tim : new Date().getTime()
        })  

        new_chapter.save(function(err,saved_chapter){
            console.log(err);
            if (err) return res.status(500).send("Please try again later");
            res.status(200).send(saved_chapter);
        })
    });
});

router.post('/list',function(req,res) {
    CourseChapter.find({ act : true }).lean().exec(function(err,chapters){
        if(err) return res.status(500).send("Please try again later");
        res.status(200).send(chapters);
    })
})

router.get('/:id',function(req,res) {
    console.log(req.params.id);
    CourseChapter.findById(req.params.id,function(err,chapter){
        if(err) return res.status(500).send("please try again later");
        if(!chapter) return res.status(400).send("No such chapter exists");
        var data = {
            chapter : chapter,
        }
        fetchQuizTopics(data,function(err,result){
            if(err) return res.status(500).send('please try again later');
            // console.log(result);
            res.status(200).send(result);
        })
    })
})

router.post('/delete',function(req,res) {
    console.log(req.body);
    CourseChapter.update({cid: req.body.cid, _id : req.body.ch_id},{act : false},function(err,updated_package){
        if(err) return res.status(500).send("Please try again later")
        res.status(200).send(updated_package);
    })
})

router.post('/edit', function(req,res) {
    console.log(req);
    var chapter = {
        nm  : req.body.name,
        dsc : req.body.dsc,
        tim : new Date().getTime()
    }  
    CourseChapter.update({cid: req.body.cid, _id : req.body.ch_id},chapter,function(err,updated_package){
        if(err) return res.status(500).send("Please try again later")
        res.status(200).send(updated_package);
    })
})

router.post('/add_quiz', function(req,res) {
    console.log(req.body);
    if(!req.body.cid) return res.status(400).send()
    if(!req.body.ch_id) return res.status(400).send()
    if(!req.body.tid) return res.status(400).send()
    CourseChapter.findOne({cid : req.body.cid,_id : req.body.ch_id},function(err,chapter) {
        if(err) return res.status(500).send("Server error");
        var quiz = {
            seq : getNextSequence(req.body.tid),
            id : req.body.tid
        }
        console.log(quiz);
        CourseChapter.update({cid : req.body.cid,_id : req.body.ch_id}, { $push : { quiz : quiz } }, function(err, updated_package) {
            if(err) return res.status(500).send("Server error");
            res.status(200).send();
        })
    })
})

router.post('/add_topic', function(req,res) {
    console.log(req.body);
    if(!req.body.cid) return res.status(400).send()
    if(!req.body.ch_id) return res.status(400).send()
    if(!req.body.tid) return res.status(400).send()
    if(!req.body.type) return res.status(400).send()
    CourseChapter.findOne({cid : req.body.cid,_id : req.body.ch_id},function(err,chapter) {
        if(err) return res.status(500).send("Server error");
        var topic = {
            type : req.body.type,
            id : req.body.tid
        }
        console.log(topic);
        CourseChapter.update({cid : req.body.cid,_id : req.body.ch_id}, { $push : { curriculum : topic } }, function(err, updated_package) {
            if(err) return res.status(500).send("Server error");
            res.status(200).send();
        })
    })
})


function fetchQuizTopics(data,cb){
    if(data.chapter && data.chapter.quiz && data.chapter.quiz.length > 0){
        var quizArr = data.chapter.curriculum.filter(function(topic){
            return topic.type == 1
        }).map(function(quiz){ return mongoose.Types.ObjectId(quiz.id) });
        CourseQuiz.find({ '_id' : { $in : quizArr } },function(err,quizzes){
            if(err) return cb(err,null);
            if(quizzes){
                console.log(quizzes);
                var temp = quizzes
                console.log(temp);
                data.quiz_all = temp.reduce(function(final,quiz){
                    final[quiz._id] = quiz;
                    return final
                },{})
                fetchLectureTopics(data,function(err,data){
                    return cb(err,data);
                })
                // return cb(null,data);
            }
            // data.quiz_all = quizzes;
            // return cb(null,data);
        })
    } else {
        return cb(null,data);
    }
}

function fetchLectureTopics(data,cb){
    if(data.chapter && data.chapter.lec){
        var lecArr = data.chapter.curriculum.filter(function(topic){
            return topic.type == 2
        }).map(function(lec){ return mongoose.Types.ObjectId(lec.id) })
        CourseLecture.find({_id : { $in : lecArr } },function(err,lectures){
            if(err) return cb(err,null)
            if(lectures){
                console.log(lectures);
                data.lec_all = lectures.reduce(function(final,lec){
                    final[lec._id] = lec;
                    return final
                },{})
                cb(null,data);
            }
        })
        // CourseLec
    } else {
        return cb(null,data);   
    }
}

module.exports = router;
























