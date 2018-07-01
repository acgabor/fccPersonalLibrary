var mongoose=require('mongoose');
mongoose.Promise = global.Promise;

var LibrarySchema=new mongoose.Schema({
  title: {type:String,required:true},
  comments: [String],
  //created_on:{type:Date, default: Date.now},
  //updated_on:{type:Date, default: Date.now},
})
var Library=mongoose.model('Library',LibrarySchema)

exports.Library = Library;

