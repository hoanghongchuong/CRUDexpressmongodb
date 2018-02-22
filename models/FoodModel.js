var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FoodSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    foodDescription: {
        type: String,
        default: ""
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    status: {
        type:[{
            type:String,
            enum: ['available', 'unavailable']
        }],
        default: ['available']
    },
    categoryId: Schema.ObjectId
});
// a setter to do something before add database
FoodSchema.path('name').set( (inputString) => {
    return inputString[0].toUpperCase() + inputString.slice(1);
});
FoodSchema.path('foodDescription').set((inputString)=>{
    return inputString[0].toUpperCase() + inputString.slice(1);
});
module.exports = mongoose.model('Food', FoodSchema);