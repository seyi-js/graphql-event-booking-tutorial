const jwt = require( 'jsonwebtoken' );
let privateKey = '232fhhsdvhjsvjhsdhfgh4344jjjcsdfjsdkjvhwkej32u32557763443((&%^$##'

exports.validateToken = ( req, res, next ) => {
    const token = req.header( 'x-auth-token' );
    if ( !token ) {
        req.errorMessage = { message: 'No token, authorization denied', code: 401 };
        return next();
        // return res.json(  )
    } else {
        if ( token ) {
            try {
                const decoded = jwt.verify( token, privateKey );
                req.user = decoded;
                return next();
            } catch ( e ) {
                // req.JWTerrorMessage = e.message;
                
                console.log( e )
                req.errorMessage = { message:'Invalid Token', code:403 };
               return next();
        

                
            }
        }
    }
};



