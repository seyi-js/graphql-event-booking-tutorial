const express = require( 'express' );
const app = express();
const { graphqlHTTP }  = require( 'express-graphql' );
const PORT = process.env.PORT || 8000;
const schema = require( './graphql/schema/index' )
const mongoose = require( 'mongoose' );
mongoose.set( 'useCreateIndex', true );
const {validateToken} = require('./helper/middleware')
//ExpressJson Middleware
app.use( express.json() );
app.use(validateToken)
app.use( '/graphql', graphqlHTTP( {
    schema,
    graphiql: true
} ) );


//Switch Between DB's in Prod
( process.env.NODE_ENV !== 'production' ) ? db = 'mongodb://localhost:27017/eventbooking' : process.env.MONGO_URL;

//Connect To Database

mongoose.connect( db, { useUnifiedTopology: true, useNewUrlParser: true } )
    .then( () => console.log( 'Connected to EventBooking Database' ) )
    .catch( ( err ) => console.log( `Database Connection Error: ${ err }` ) );

//     const User = require('./Models/user')
// let user = await User.find({})
// console.log(user)


app.listen(PORT, () => console.log(`Server running on port ${PORT} 🔥`));