const mongoose = require("mongoose");


const dbSchema=new mongoose.Schema({
    id:String,
    title: String,
    columnKey:String,
    visibility:Number,
    content:String,
    status:String
  }, {
    toJSON: {
        transform: function (doc, ret) {
        delete ret.__v;
        delete ret._id;
        }
    }
  });
  const boardSchema=new mongoose.Schema({
    boardData:[dbSchema],
    id:String,
    title:String,
    content:String,
    permission:String,
    priority:String,
    flag:Boolean
  })
  
  
  
  module.exports= mongoose.model("boardList",boardSchema);