const EventModel = require( '../../models/event' );
const {creator,getEvents,genHash,getSingleEvent} = require('../../helper/helper');
const UserModel = require( '../../models/user' );
const BookingModel = require('../../models/bookings')
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

exports.createdEventsResolver = ( args ) => {
    let event = new EventModel( {
        title: args.title,
        description: args.description,
        price: args.price,
        creator: '5ff658fc8a8fdc33a0e1a780'
    } );

    return event.save()
        .then( async result => {
            // console.log( result )
            try {
                let user = await UserModel.findById( '5ff658fc8a8fdc33a0e1a780' );
                user.createdEvents.push( result._id );
                user.save();
                return { ...result._doc };
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

exports.bookEventResolver = async ( args ) => {
    try {
      
        const booking = new BookingModel( {
            user: '5ff817dcf9d53e25048fe8e9',
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
}