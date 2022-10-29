
const mongoose = require("mongoose");
const passportLocal = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const userdbSchema=new mongoose.Schema({
    email:String,
    name:String,
    boardId:[String]
  })
  userdbSchema.plugin(passportLocal,{
    usernameField:"email",
    errorMessages:{UserExistsError:"Email already exists!"}
  });
  userdbSchema.plugin(findOrCreate);

module.exports = new mongoose.model("userList",userdbSchema);;