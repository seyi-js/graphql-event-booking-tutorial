const bcrypt = require('bcryptjs');



//@desc Gen Hash
const genHash =  ( data ) => {
    let hash;
    var salt = bcrypt.genSaltSync(12);
     hash = bcrypt.hashSync(data, salt);
    
    return hash;
}


module.exports ={genHash}