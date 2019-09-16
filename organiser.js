var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var organiserSchema =new Schema({
	
    _id:{
        type:String,
        unique:true,
        required:true
    },

	name:{
        type:String,
        required:true
	},
	
	password:{
        type:String,
        required:true	
	}
	
});
	module.exports= mongoose.model('Organiser',organiserSchema);