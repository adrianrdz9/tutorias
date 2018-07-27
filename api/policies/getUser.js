module.exports = function(req, res, next){
  if(req.user !== undefined){
    res.locals.user = req.user;
  }else{
    res.locals.user = null;
  }

  next();
};
