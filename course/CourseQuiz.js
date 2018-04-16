var mongoose 	= require('mongoose');

var Schema 		= mongoose.Schema;
var ObjectId 	= Schema.ObjectId;

var coursequiz = new mongoose.Schema(
	{
		cid             : { type : ObjectId, required : true },
		nm       		: { type : String, required : true },
		dsc       		: { type : String, required : true },
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