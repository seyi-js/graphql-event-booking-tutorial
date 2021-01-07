const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
const eventSchema = new mongoose.Schema( {
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    creator:{
        type:ObjectId,
        ref:'users'
    }
} );


const EventModel = mongoose.model( 'events', eventSchema );
module.exports = EventModel;