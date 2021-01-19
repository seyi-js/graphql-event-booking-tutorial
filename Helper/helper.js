const bcrypt = require('bcryptjs');
const UserModel = require('../models/user')
const EventModel = require('../models/event')
const jwt = require( 'jsonwebtoken' );

//@desc Gen Hash
const genHash = ( data ) => {
    let hash;
    var salt = bcrypt.genSaltSync( 12 );
    hash = bcrypt.hashSync( data, salt );
    
    return hash;
};

let count = 0;
//@desc Get Creator
const creator = ( userId ) => {
    count++;
    // console.log(count)
    return UserModel.findById( userId )
        .then( user => {
            // console.log(userId)
            return { ...user._doc, createdEvents: getEvents.bind( this, user.createdEvents ) }
        } )
        .catch( err => {
            throw err;
        } );
};

//@desc Get Events
const getEvents = ( eventIds, getCreator ) => {
    return EventModel.find( { _id: { $in: eventIds } } )
        .then( events => {
            return events.map( event => {
                // let creator = getCreator?creator(event.creator): null
                return { ...event._doc, creator: creator.bind( this, event.creator ) }
            } )

            
        } )
        .catch( err => {
            throw err;
        } );
};


const getSingleEvent = async ( eventId ) => {
    let event = await EventModel.findById( eventId );
    
    return event;
};


let privateKey = '232fhhsdvhjsvjhsdhfgh4344jjjcsdfjsdkjvhwkej32u32557763443((&%^$##'
//@desc Genarate Json Web Tokens
const generateJwtToken = ( id ) => {
    const token = jwt.sign(
        { id },
        `${ privateKey }`,
        { expiresIn: 60 * 1000 * 60 * 24 } )//Expires in 24hrs 
       
    return token;
};

const verifyIfUserIsAuthenticated = ( req ) => {
    if ( !req.user || req.errorMessage ) {
        return req.errorMessage;
    } else {
        let response = {
            user:req.user
        };
        return response;
    }
};

module.exports ={genHash,creator,getEvents,getSingleEvent,generateJwtToken,verifyIfUserIsAuthenticated}