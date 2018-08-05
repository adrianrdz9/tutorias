module.exports = function(req, res, next){ 
    //Defaults messages to prevent errors   
    res.locals.messages = {error: [], warning: [], success: []};

    //Defines a new redirect method (with flash message)
    res.redirectF = function(path, flash){
        req.session.messages = {error: [], warning: [], success: []};
        if(flash){
            for(key in flash){
                req.session.messages[key].push(flash[key]);
            }
        }
        res.redirect(path);
    }


    if(!req.session.messages) {
        return next();
    }
    
    //Send flash through locals
    res.locals.messages = _.clone(req.session.messages);

    
    // Clear flash from session
    req.session.messages = { success: [], error: [], warning: [] };

    return next();
}