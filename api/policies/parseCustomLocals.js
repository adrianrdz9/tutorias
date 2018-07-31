//Send session.custom object to view locals
const bcrypt = require("bcrypt");

module.exports = function(req, res, next){
    
    if(req.session.custom !== undefined && req.session.custom.locals){
        //Prevent old locals from beign deleted
        for(key in req.session.custom.locals){
            res.locals[key] = req.session.custom.locals[key]
        }
    }
    //Remove custom locals from the session
    req.session.custom = undefined;
    const moment = require("moment");
    moment.locale("es");
    res.locals.moment = moment



    next();
}