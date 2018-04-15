var mongoose 	= require('mongoose');

var Schema 		= mongoose.Schema;
var ObjectId 	= Schema.ObjectId;

var coursequiz = new mongoose.Schema(
	{
		cid             : { type : ObjectId, required : true },    // course id of the course
		// tid             : { type : ObjectId, required : true },    // quiz server actual test id
		// gid             : { type : ObjectId, required : false },    // group id of the quiz
		// plid            : { type : ObjectId, required : false },    // plugin id of the quiz
		// gcod            : { type : String, required : false },      // group code of the quiz
		nm       		: { type : String, required : true },      // title name of the quiz 
		dsc       		: { type : String, required : true },      // description of the quiz
		// url             : { type : String, required : false },     // link to any external links to the quiz
		tim             : { type : Number, required : true },    
		act             : { type : Boolean, required : true }     
	},
	{ 
		timestamps : true
	}
);

coursequiz.index({cid:1,act:1});

mongoose.model('CourseQuiz',coursequiz);

module.exports = mongoose.model('CourseQuiz');