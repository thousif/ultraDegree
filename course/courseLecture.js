var mongoose 	= require('mongoose');

var Schema 		= mongoose.Schema;
var ObjectId 	= Schema.ObjectId;

var courselecture = new mongoose.Schema(
	{
		cid         : { type : ObjectId, required : true },    
		nm       		: { type : String, required : true },   
		dsc       	: { type : String, required : true },
		typ         : { type : Number, required : true, default : 1 },
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