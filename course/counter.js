var mongoose 	= require('mongoose');

var Schema 		= mongoose.Schema;
var ObjectId 	= Schema.ObjectId;

var counter = new mongoose.Schema(
	{
		seq       : { type : Number, default : 0 },
	},{
		collection : 'counter'
	}
);

mongoose.model('counter',counter);

module.exports = mongoose.model('counter');	