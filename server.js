const express = require( 'express' );
const app = express();

const PORT = process.env.PORT || 8000;


//ExpressJson Middleware
app.use( express.json() );

app.get( '/', ( req, res ) => {
    res.json('Hello world!')
})

app.listen( PORT, () => console.log( `Server started on port ${ PORT }` ) );