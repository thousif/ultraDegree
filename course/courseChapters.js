var mongoose 	= require('mongoose');

var Schema 		= mongoose.Schema;
var ObjectId 	= Schema.ObjectId;

var coursechapter = new mongoose.Schema(
	{
		cid         : { type : ObjectId, required : true },              // course id of the course
		nm       		: { type : String, required : true },                // name   
		dsc         : { type : String, required : true },                // description 
		lec         : { type : Array, required : false, default : []},   // lectures in the chapter
		quiz        : { type : Array, required : false, default : []},   // quizzes in the  chapter
		asgn        : { type : Array, required : false, default : []},   // assignments at the chapter
		pdf         : { type : Array, required : false, default : []},   // pdfs available at the chapter
		lnk         : { type : Array, required : false, default : []},   // hyperlinks avaialble at the chapter
		seq         : { type : Number, required : true },                // sequence number of the chapter 
		tim         : { type : Number, required : true },    
		act         : { type : Boolean, required : true }     
	},
	{ 
		timestamps : true
	}
);

coursechapter.index({cid:1,act:1});

mongoose.model('CourseChapter',coursechapter);

module.exports = mongoose.model('CourseChapter');