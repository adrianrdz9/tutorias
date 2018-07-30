module.exports = function(req, res, next){
    //Only allow auth users to visit certain pages
    if(res.locals.user === null){
        next();
    }
    res.redirectF("/", {warning: ["Ya iniciaste sesion"]});
}