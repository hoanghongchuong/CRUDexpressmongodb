var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    birthday: {
        type: Date
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    image: {
        type: String
    },
    role: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at:{
        type: Date
    }
});
module.exports = mongoose.model('Users', UserSchema);