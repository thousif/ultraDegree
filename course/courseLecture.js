var mongoose 	= require('mongoose');

var Schema 		= mongoose.Schema;
var ObjectId 	= Schema.ObjectId;

var courselecture = new mongoose.Schema(
	{
		cid         : { type : ObjectId, required : true },    // course id of the course
		// gid         : { type : ObjectId, required : false },    // group id of the video lecture
		// plid        : { type : ObjectId, required : false },    // plugin id of the video lecture
		// gcod        : { type : String, required : false },    // group code of the video lecture
		nm       		: { type : String, required : true },    // name   
		dsc       	: { type : String, required : true },    // description  
		// url         : { type : String, required : true },    // video url of the video lecture
		// vlen        : { type : String, required : false },    // length of the video
		typ         : { type : Number, required : true, default : 1 },
		// quiz        : { type : Array, required : false, default : []},  // quizzes in the  lecture
		// asgn        : { type : Array, required : false, default : []},  // assignments at the lecture
		// pdf         : { type : Array, required : false, default : []},  // pdfs available at the lecture
		// lnk         : { type : Array, required : false, default : []},  // hyperlinks avaialble at the lecture
		tim         : { type : Number, required : true },    
		act         : { type : Boolean, required : true }     
	},
	{ 
		timestamps : true
	}
);

courselecture.statics = {
	TYPE : {
		DEFAULT : 1,
		CUSTOM  : 2
	}
}

courselecture.index({cid:1,act:1});

mongoose.model('CourseLecture',courselecture);

module.exports = mongoose.model('CourseLecture');