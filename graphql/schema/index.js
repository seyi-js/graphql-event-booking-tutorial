const { GraphQLObjectType, GraphQLInt,
    GraphQLSchema, GraphQLString,
    GraphQLNonNull, GraphQLList,GraphQLFloat,GraphQLID } = require( 'graphql' );
const { getAllEventsResolver,
    getAllUsersResolver, registerUserResolver,
    createdEventsResolver, bookEventResolver, getAllBookingsResolver,
cancelBookingResolver,loginResolver} = require( '../resolvers/index' )

const {verifyIfUserIsAuthenticated} = require('../../helper/helper')



const EventType = new GraphQLObjectType( {
    name: 'Events',
    fields: () => ( {
        _id:{type:new GraphQLNonNull(GraphQLID)},
        title:{type:new GraphQLNonNull(GraphQLString)},
        description:{type:new GraphQLNonNull(GraphQLString)},
        price: { type: new GraphQLNonNull( GraphQLString ) },
        date: { type: new GraphQLNonNull( GraphQLString ) },
        creator:{type:  UserType }
    })
});


const UserType = new GraphQLObjectType( {
    name: 'User',
    fields: () => ( {
        _id:{type:new GraphQLNonNull(GraphQLID)},
        email:{type:new GraphQLNonNull(GraphQLString)},
        // password: { type: GraphQLString },
        createdEvents:{type: new GraphQLList(EventType)}
       })
})

const BookingType = new GraphQLObjectType( {
    name: 'Bookings',
    fields: () => ( {
        _id:{type:new GraphQLNonNull(GraphQLID)},
        event:{type:new GraphQLNonNull(EventType)},
        user:{type:new GraphQLNonNull(UserType)},
        createdAt:{type:new GraphQLNonNull(GraphQLString)},
        updatedAt:{type:new GraphQLNonNull(GraphQLString)}
        
    })
});

const AuthType = new GraphQLObjectType( {
    name: 'AuthData',
    fields: () => ( {
        userId:{type:GraphQLID},
        token:{type:GraphQLString},
        tokenExpiration:{type:GraphQLString}
        
    })
});

//Root Query

const RootQuery = new GraphQLObjectType( {
    name: 'RootQueryType',
    fields: {
        events: {
            type: new GraphQLList(EventType ),
            resolve(parentValue,args ) {
                    return  getAllEventsResolver()
                
             
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve( parentValue, args ) {
              return getAllUsersResolver()
            }
        },
        bookings: {
            type: new GraphQLList(BookingType),
            resolve( parentValue, args,req ) {
                
                let response = verifyIfUserIsAuthenticated( req );
                // console.log(response)
                if ( response.user ) {
                    return getAllBookingsResolver()
                } else {
                    //Error Message
                    throw new Error(response.message)
                }
            }
        },
        login: {
            type: AuthType,
            args: {
                email:{type:new GraphQLNonNull(GraphQLString)},
                password: { type: new GraphQLNonNull( GraphQLString ) }
            },
            resolve( parentvalue, args ) {
                return loginResolver(args)
            }
        }
    }
} );


//Mutation
const Mutation = new GraphQLObjectType(  {
    name: 'Mutation',
    fields: {
        createEvent: {
            type: EventType,
            args: {
                _id:{type:GraphQLID},
                title:{type:new GraphQLNonNull(GraphQLString)},
                description:{type:new GraphQLNonNull(GraphQLString)},
                price: { type: new GraphQLNonNull( GraphQLString ) },
                date: { type: GraphQLString },
                creator:{type: GraphQLString }
                
            },
            resolve(parentValue, args,req) {
                let response = verifyIfUserIsAuthenticated( req );
                // console.log(response)
                if ( response.user ) {
                    return createdEventsResolver(args,response.user)
                } else {
                    //Error Message
                    throw new Error(JSON.stringify(response))
                }
             }
        },
        registerUser: {
            type: UserType,
            args: {
                email:{type:new GraphQLNonNull(GraphQLString)},
                password:{type: new GraphQLNonNull( GraphQLString )}
            },
           resolve( parentValue, args ) {
               return registerUserResolver( args );
               
        }
        },
        bookEvent:{
            type: BookingType,
            args: {
                eventId:{type:GraphQLID}
            },
            resolve( parentValue, args,req ) {
                let response = verifyIfUserIsAuthenticated( req );
                // console.log(response)
                if ( response.user ) {

                    return bookEventResolver( args,response.user );
                } else {
                    //Error Message
                    throw new Error(response.message)
                }
            }

        },
        cancelBooking: {
            type: EventType,
            args: {
                bookingId:{type:GraphQLID}
            },
            resolve(parentValue, args,req ) {
                
                let response = verifyIfUserIsAuthenticated( req );
                // console.log(response)
                if ( response.user ) {
                    return cancelBookingResolver( args );
                } else {
                    //Error Message
                    throw new Error(response.message)
                }
            }
        }
        
    }
} );

module.exports = new GraphQLSchema( {
    query: RootQuery,
    mutation:Mutation
})