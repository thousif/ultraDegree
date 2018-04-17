var mongoose = require('mongoose');
var configs = require('./config');
mongoose.connect(configs.MONGO_URL, { useMongoClient: true });