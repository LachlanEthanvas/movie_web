const mongoose = require('mongoose')
const EntrySchema = new mongoose.Schema({
  title:{type:String, required:true},
  type:{type:String, enum:['Movie','TV Show'], required:true},
  description:String,
  images: [{ url: String, thumbUrl: String, filename: String }],
  approved:{type:Boolean, default:false},
  createdBy:{type: mongoose.Schema.Types.ObjectId, ref:'User', required:true},
  deletedAt: Date
},{timestamps:true})
module.exports = mongoose.model('Entry', EntrySchema)

