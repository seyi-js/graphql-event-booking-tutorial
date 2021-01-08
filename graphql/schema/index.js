const { GraphQLObjectType, GraphQLInt,
    GraphQLSchema, GraphQLString,
    GraphQLNonNull, GraphQLList,GraphQLFloat,GraphQLID } = require( 'graphql' );
const {getAllEventsResolver,getAllUsersResolver,registerUserResolver,createdEventsResolver} = require('../resolvers/index')
//EventType
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

//Root Query

const RootQuery = new GraphQLObjectType( {
    name: 'RootQueryType',
    fields: {
        events: {
            type: new GraphQLList(EventType ),
            resolve() {
              return  getAllEventsResolver()
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve( parentValue, args ) {
              return getAllUsersResolver()
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
                return createdEventsResolver(args)
             }
        },
        registerUser: {
            type: UserType,
            args: {
                email:{type:new GraphQLNonNull(GraphQLString)},
                password:{type: new GraphQLNonNull( GraphQLString )}
            },
           resolve( parentValue, args ) {
            return registerUserResolver(args)
        }
       }
        
    }
} );

module.exports = new GraphQLSchema( {
    query: RootQuery,
    mutation:Mutation
})