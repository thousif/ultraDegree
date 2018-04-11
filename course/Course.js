var mongoose 	= require('mongoose');

var Schema 		= mongoose.Schema;
var ObjectId 	= Schema.ObjectId;

var course = new mongoose.Schema(
	{
		name 	       : { type : String, required : true },			  // name of the course
		u_tag          : { type : String, required : true },        // unique tag
		desc 	       : { type : String, required : true },        // description of the course
		t_url          : { type : String, required : true },				// thuimb url
		i_paid         : { type : Boolean, default : false },       // is the course paid
		type           : { type : Number, default : 1 },            // type of the course
		duration       : String,																		// course duration string
		status         : { type : Number, default : 1 },            // status of the course
		i_seats_l      : { type : Boolean, default : false },       // is seats limited for the course
		seats_n        : Number,																	  // number of seats if limited above is true
		aid 	       : { type : ObjectId, required : true },      // account id of the course creater	
	},{
		collection : 'course'
	}
);

mongoose.model('course',course);

module.exports = mongoose.model('course');	