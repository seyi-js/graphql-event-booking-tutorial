const { GraphQLObjectType, GraphQLInt,
    GraphQLSchema, GraphQLString,
    GraphQLNonNull, GraphQLList,GraphQLFloat,GraphQLID } = require( 'graphql' );

const EventModel = require( './Models/event' );
const UserModel = require( './Models/user' );
const {genHash} = require('./Helper/helper')
const events = []
//EventType
const EventType = new GraphQLObjectType( {
    name: 'Events',
    fields: () => ( {
        _id:{type:new GraphQLNonNull(GraphQLID)},
        title:{type:new GraphQLNonNull(GraphQLString)},
        description:{type:new GraphQLNonNull(GraphQLString)},
        price: { type: new GraphQLNonNull( GraphQLString ) },
        date: { type: new GraphQLNonNull( GraphQLString ) },
        creator:{type: new GraphQLNonNull( GraphQLString )}
    })
});


const UserType = new GraphQLObjectType( {
    name: 'User',
    fields: () => ( {
        _id:{type:new GraphQLNonNull(GraphQLID)},
        email:{type:new GraphQLNonNull(GraphQLString)},
        password:{type:GraphQLString}
       })
})

//Root Query

const RootQuery = new GraphQLObjectType( {
    name: 'RootQueryType',
    fields: {
        events: {
            type: new GraphQLList(EventType ),
            resolve( parentValue, args ) {
               return EventModel.find({})
                    .then( events => {
                    return events
                })
                    .catch( err => {
                        console.log( err );
                        throw err;
                })
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
            resolve(parentValue, args) {
                
                let event = new EventModel( {
                    title: args.title,
                    description: args.description,
                    price: args.price,
                    creator:'5ff658fc8a8fdc33a0e1a780'
                } );

             return  event.save()
                    .then(async result => {
                    console.log(result)
                    
                        let user = await UserModel.findById( '5ff658fc8a8fdc33a0e1a780' );
                        user.createdEvents.push( result._id );
                        user.save();
                        return {...result._doc};
                })
                .catch(err=>{
                    console.log(err);
                throw err;
                })
                
               
            }
        },
        registerUser: {
            type: UserType,
            args: {
                email:{type:new GraphQLNonNull(GraphQLString)},
                password:{type: new GraphQLNonNull( GraphQLString )}
            },
           async resolve( parentValue, args ) {
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
       }
        
    }
} );

module.exports = new GraphQLSchema( {
    query: RootQuery,
    mutation:Mutation
})