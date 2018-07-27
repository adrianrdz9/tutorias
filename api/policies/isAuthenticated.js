module.exports = function(req, res, next){
  if(req.isSocket){
    if(req.session && req.sesion.passport && req.sesion.passport.user){
      return next();
    }
    res.json(401);
  }else{
    sails.log(req.isAuthenticated());
    if( req.isAuthenticated() ){

      return next();
    }
    res.redirect('/users/login');
  }
};
