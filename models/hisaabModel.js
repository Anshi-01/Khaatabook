const mongoose = require("mongoose");
const db= require("../config/mongoose-connection");


const hisaabSchema = mongoose.Schema({
    title: String,
    data: String,
    user: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    editeable: Boolean,
    shareable: Boolean,
    encrypted: Boolean,
    passcode: String

},
{timestamps: true},
);

module.exports = mongoose.model("hisaab", hisaabSchema);
