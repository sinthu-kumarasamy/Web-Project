const mongoose = require('mongoose');

var expenseSchema = new mongoose.Schema({
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
	},
	description:{
		type:String,
	}
});


module.exports = mongoose.model('Expense',expenseSchema);