const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcrypt-nodejs');

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({id}, (err, user) => {
    cb(err, user);
  });
});

passport.use(new LocalStrategy({
  usernameField: 'account_number',
  passwordField: 'password'
}, ((username, password, cb) => {

    sails.log(username);
    User.findOne({account_number: username}, (err, user) => {
      if(err) {return cb(user);}
      if(!user) {return cb(null, false, {message: 'Usuario no encontrado'});}

      bcrypt.compare(password, user.password, (err, res) => {
        sails.log('Contraseña incorrecta');
        if(!res) {return cb(null, false, {message: 'Contraseña incorrecta'});}
      });

      let userDetails = {
        account_number: user.account_number,
        name: user.name,
        last_name: user.last_name,
        id: user.id
      };
      sails.log(userDetails);
      return cb(null, userDetails, {message: 'Sesion iniciada'});
    });
  })));
