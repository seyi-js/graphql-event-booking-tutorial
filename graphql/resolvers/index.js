const EventModel = require( '../../Models/event' );
const {creator,getEvents,genHash} = require('../../Helper/helper')
const UserModel = require('../../Models/user')
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
                    creator: creator( event.creator )
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
        
            let user = await UserModel.findById( '5ff658fc8a8fdc33a0e1a780' );
            user.createdEvents.push( result._id );
            user.save();
            return { ...result._doc };
        } )
        .catch( err => {
            console.log( err );
            throw err;
        } )
};

exports.registerUserResolver= async (args)=>{
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
            return {...result._doc, password:null}
        } )
        .catch( err => {
            console.log( err );
            throw err;
    })
    } 
    }
}