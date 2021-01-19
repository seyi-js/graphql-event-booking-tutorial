const EventModel = require( '../../models/event' );
const {creator,getEvents,genHash,getSingleEvent,generateJwtToken} = require('../../helper/helper');
const UserModel = require( '../../models/user' );
const BookingModel = require( '../../models/bookings' );
const bcrypt = require('bcryptjs');
exports.getAllEventsResolver = () => {
      
    return EventModel.find( {} )
        .then( events => {
             
            return events.map( event => {
                 
                // return  {
                //     ...event,
                //     // creator:creator( event.creator)
                // }
                return {
                    ...event._doc, createdEvents: null,
                    creator: creator.bind(this, event.creator )
                }
            } )
         
        } )
        .catch( err => {
            console.log( err );
            throw err;
        } )
 
};

exports.getAllUsersResolver = () => {
    return UserModel.find( {} ).select( "-password" )
        .then( users => {
            // return users;
            let getCreator = null
            return users.map( user => {

                return { ...user._doc, createdEvents: getEvents( user._doc.createdEvents, getCreator ) }
            } )
        } )
        .catch( err => {
            console.log( err );
            throw err;
        } )
};

exports.createdEventsResolver = ( args,reqUser ) => {
    let event = new EventModel( {
        title: args.title,
        description: args.description,
        price: args.price,
        creator: reqUser.id
    } );

    return event.save()
        .then( async result => {
            // console.log( result )
            try {
                let user = await UserModel.findById( reqUser.id );
                user.createdEvents.push( result._id );
                user.save();
                return { ...result._doc,creator: creator.bind(this, result.creator ) };
            } catch ( error ) {
                console.log( error )
                throw error;
                
            };
        
            
        } )
        .catch( err => {
            console.log( err );
            throw err;
        } );
};

exports.registerUserResolver = async ( args ) => {
    try {
        
    let foundUser = await UserModel.findOne( { email: args.email } )
    if ( foundUser ) {
         throw new Error('User exists')
    } else {
         
    let passwordHash = genHash(args.password)
    if ( passwordHash ) {
        let user = new UserModel( {
            email: args.email,
            password: passwordHash 
        } );
        return user.save()
            .then( result => {
                return { ...result._doc, password: null }
            } )
            .catch( err => {
                console.log( err );
                throw err;
            } );
        };
        };
    } catch (err) {
        console.log( err );
        throw err;
    };
};

exports.getAllBookingsResolver = async()=>{
    try {
        let bookings = await BookingModel.find( {} ).populate('user').populate('event')
        return bookings;
    } catch (err) {
        console.log(err);
        throw err;
    };
};

exports.bookEventResolver = async ( args,user ) => {
    try {
      
        const booking = new BookingModel( {
            user: user.id,
            event: args.eventId
        } );

        let savedBooking = await booking.save();

        return {
            ...savedBooking._doc,
            user: creator.bind( this, savedBooking._doc.user ),
            event: getSingleEvent.bind( this, savedBooking._doc.event )
        };
    } catch ( err ) {
        console.log( err );
        throw err;
    };
};

exports.cancelBookingResolver = async ( args ) => {
    try {
        let booking = await BookingModel.findById(args.bookingId).populate('event')

        let event = { ...booking.event._doc, creator: creator.bind( this, booking.event._doc.creator ) };

        await BookingModel.deleteOne( { _id: args.bookingId } );
        
        return event;
    } catch (err) {
        console.log( err );
        throw err;
    }
};

exports.loginResolver = async ( args) => {
    // console.log(req)
    let { email, password } = args;
    if ( !email || !password ) {
        throw new Error('Invalid request.')
    }

    try {
        let user = await UserModel.findOne( { email } );
        if ( !user ) {
            // return 'User not found'
            throw new Error( 'User not found.' );
            
        }
        let isEqual = bcrypt.compareSync( password, user.password );
        if ( !isEqual ) {
            throw new Error('Incorrect password');
        }

        let token = generateJwtToken( user._id );

        return {userId:user._id,token,tokenExpiration:'1'}

    } catch (err) {
        // console.log( err );
        throw new Error( err );
    }
}