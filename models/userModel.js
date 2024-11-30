const mongoose = require("mongoose");
const db= require("../config/mongoose-connection")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [50, 'Username must be at most 50 characters long'],
      },
      name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [100, 'Name must be at most 100 characters long'],
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
      },
      hisaabs:[
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "hisaab",
        }
      ]

});

module.exports = mongoose.model("user", userSchema);
