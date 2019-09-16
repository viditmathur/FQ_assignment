var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var eventSchema =new Schema({
	
    _id:{
        type:String,
        unique:true,
    },

	name:{
		type:String,
	},
	
	organiser:{
		type:String	
	},
	
	time:
	{type:String
	},
	
	Date: {
		type:Date
	},
	
	Description:
	{type:String	
	}
});
	module.exports= mongoose.model('Event',eventSchema);