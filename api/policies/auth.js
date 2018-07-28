module.exports = function(req, res, next){
    //Only allow auth users to visit certain pages
    if(res.locals.user === null){
        return res.redirectF('/users/login', {warning: ['Debes estar registrado para ver esta pagina.']});
    }
    next();
}