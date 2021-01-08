const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema( {
    email: {
        type: String,
        required: true,
        unique:true,
        uniqueCaseInsensitive: true
    },
    password: {
        type: String,
        required: true
    },
    createdEvents: [
        {
            type: ObjectId,
            ref: 'events'
        }
    ]
} );


const UserModel = mongoose.model( 'users', userSchema );
module.exports = UserModel;