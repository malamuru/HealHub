const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const eventSchema = new mongoose. Schema({
    category: {type: String, required: [true, 'category is required'], enum: ['Physical Health', 'Mental Health', 'Nutrition', 'Fitness','Disease Prevention', 'Other']},
    title: {type: String, required: [true, 'title is required'] },  
    description: {type: String, required: [true, 'description is required'], minlength: [15, 'description must be at least 15 characters long']},
    host: { type: Schema.Types.ObjectId, ref: 'User' },
    startDate: {type: Date, required:[ true,'startDate is required']},
    endDate: {type: Date, required:[ true,'endDate is required']},
    location: {type: String, required:[ true, 'location is required']},
    image: {type: String, required: [ true,'image is required']},
},
{timestamps: true}
);

//collection name is events in the databse
module.exports = mongoose.model('Event', eventSchema);


