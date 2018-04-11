var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
var CourseChapter = require('./courseChapters');

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
    console.log(req.body);
    CourseChapter.find({ cid : req.body.cid, act : true },function(err,chapters){
        if(err) return res.status(500).send("Please try again later");
        res.status(200).send(chapters);
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
    console.log(req.body);
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

module.exports = router;