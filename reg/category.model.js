const mongoose = require('mongoose');

var reminderSchema = new mongoose.Schema({
	email:{
		type:String,
	},
	date:{
		type:Date,
	},
	category:{
		type:String,
	},
	amount:{
		type:Number,
	}
});


module.exports = mongoose.model('Reminder',reminderSchema);