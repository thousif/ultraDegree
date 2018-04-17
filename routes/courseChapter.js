var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var VerifyToken = require('../auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var CourseChapter = require('../models/courseChapters');
var CourseQuiz = require('../models/courseQuiz');
var CourseLecture = require('../models/courseLecture');

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

router.post('/add',  VerifyToken,  function (req, res) {
    
    req.checkBody('cid','invalid parameters').notEmpty().isValidMongoId();

    if(req.validationErrors()){ 
        res.status(400).send("Invalid parameters");
        return 
    }

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

router.post('/list', VerifyToken, function(req,res) {
    CourseChapter.find({ act : true }).sort({tim : -1}).lean().exec(function(err,chapters){
        if(err) return res.status(500).send("Please try again later");
        res.status(200).send(chapters);
    })
})

router.post('/open', VerifyToken, function(req,res) {
    
    req.checkBody('cid','invalid parameters').notEmpty().isValidMongoId();
    req.checkBody('ch_id','invalid parameters').notEmpty().isValidMongoId();

    if(req.validationErrors()){ 
        res.status(400).send("Invalid parameters");
        return 
    }

    if(!req.body.cid)  return res.status(400).send("invalid parameters");
    if(!req.body.ch_id)  return res.status(400).send("invalid parameters");
    CourseChapter.findOne({
        cid : req.body.cid,
        _id : mongoose.Types.ObjectId(req.body.ch_id),
        act : true
    },function(err,chapter){
        console.log(chapter);
        if(err) return res.status(500).send("please try again later");
        if(!chapter) return res.status(400).send("No such chapter exists");
        console.log(chapter);
        var data = {
            chapter : chapter,
        }
        fetchQuizTopics(data,function(err,result){
            if(err) return res.status(500).send('please try again later');
            res.status(200).send(result);
        })
    })
})

router.post('/delete', VerifyToken, function(req,res) {
    
    req.checkBody('cid','invalid parameters').notEmpty().isValidMongoId();
    req.checkBody('ch_id','invalid parameters').notEmpty().isValidMongoId();

    if(req.validationErrors()){ 
        res.status(400).send("Invalid parameters");
        return 
    }

    CourseChapter.update({cid: req.body.cid, _id : req.body.ch_id},{act : false},function(err,updated_package){
        if(err) return res.status(500).send("Please try again later")
        res.status(200).send(updated_package);
    })
})

router.post('/edit', VerifyToken, function(req,res) {
    req.checkBody('name','invalid parameters').notEmpty();
    req.checkBody('dsc','invalid parameters').notEmpty();

    if(req.validationErrors()){ 
        res.status(400).send("Invalid parameters");
        return 
    }

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

router.post('/add_quiz', VerifyToken, function(req,res) {

    req.checkBody('cid','invalid parameters').notEmpty().isValidMongoId();
    req.checkBody('ch_id','invalid parameters').notEmpty().isValidMongoId();
    req.checkBody('tid','invalid parameters').notEmpty().isValidMongoId();

    if(req.validationErrors()){ 
        res.status(400).send("Invalid parameters");
        return 
    }

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

router.post('/add_topic', VerifyToken, function(req,res) {
    
    req.checkBody('cid','invalid parameters').notEmpty().isValidMongoId();
    req.checkBody('ch_id','invalid parameters').notEmpty().isValidMongoId();
    req.checkBody('tid','invalid parameters').notEmpty().isValidMongoId();
    req.checkBody('type','invalid parameters').notEmpty();

    if(req.validationErrors()){ 
        res.status(400).send("Invalid parameters");
        return 
    }

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

router.post('/update_cur', VerifyToken, function(req,res) {
    
    req.checkBody('cid','invalid parameters').notEmpty().isValidMongoId();
    req.checkBody('ch_id','invalid parameters').notEmpty().isValidMongoId();
    req.checkBody('cur','invalid parameters').notEmpty().isArray();

    if(req.validationErrors()){ 
        res.status(400).send("Invalid parameters");
        return 
    }

    CourseChapter.update({cid: req.body.cid, _id : req.body.ch_id},{
        curriculum : req.body.cur
    },function(err,updated_package){
        if(err) return res.status(500).send("Please try again later")
        res.status(200).send(updated_package);
    })
})

function fetchQuizTopics(data,cb){
    if(data.chapter && data.chapter.curriculum && data.chapter.curriculum.length > 0){
        var quizArr = data.chapter.curriculum.filter(function(topic){
            return parseInt(topic.type) == 1 
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
    } else {
        return cb(null,data);   
    }
}

module.exports = router;
























