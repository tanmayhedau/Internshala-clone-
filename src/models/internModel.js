const mongoose = require('mongoose');
const objId = mongoose.Schema.Types.ObjectId;

const internSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim:true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim:true
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
  },
  collegeId: {
    type: objId,
    ref: "collegeList",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  
},{timestamp : true});


module.exports = mongoose.model('internList',internSchema)