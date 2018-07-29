/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 const bcrypt = require('bcrypt');

module.exports = {
  signup: async function(req, res){
    //Save the old data so that the user doesnt have to re-introduce it
    req.session.custom = {
      locals: {
        old: {
          name: req.body.name,
          account_number: req.body.account_number
        }
      }
    }

    //Validate password confirmation
    if(req.body.pass1 === req.body.pass2){
      try{
        // Create User
        const user = await User.create({
          name: req.body.name,
          account_number: req.body.account_number,
          password: req.body.pass1
        }).fetch();

        //Save created user to session
        req.session.userId = user.id;
        return res.redirectF(req.session.redirectAfterAuthPath || '/', {success: ['Sesion iniciada']})
      }catch(err){

        if(err.code === 'E_UNIQUE')
          //Redirect with a flash message with the error
          return res.redirectF('/users/sign_up', {error: ['Ya hay un usuario con este numero de cuenta']});
      }
    }else{
      //Redirect with a flash message with the error
      return res.redirectF('/users/sign_up', {error: ['Las contraseñas no coinciden']});
    }
  },

  signupForm: function(req, res){
    //Display sign up form
    return res.view('users/sign_up')
  },

  login: async function(req, res){
    //Save the old data so that the user doesnt have to re-introduce it
    req.session.custom = {
      locals: {
        old: {
          account_number: req.body.account_number
        }
      }
    }

    try{
      //Find user with the provided account number if any
      const user = await User.findOne({account_number: req.body.account_number});

      //No user
      if(user === undefined) return res.redirectF('/users/login', {error: ['Numero de cuenta incorrecto']});

      //Compare password
      bcrypt.compare(req.body.password, user.password, function(err, same){
        if(err) return res.redirectF('/users/login', {error: [err.code]});
        if(!same) return res.redirectF('/users/login', {error: ['Contraseña incorrecta']});

        //Save user in the session
        req.session.userId = user.id;

        return res.redirectF(req.session.redirectAfterAuthPath || '/', {success: ['Sesion iniciada']});
      })
    } catch(err){
      sails.log(err);
      return res.redirectF('/users/login', {error: [err.code]});
    }
  },

  loginForm: function(req, res){
    //Display login form
    return res.view('users/login')
  },

  logout: function(req, res){
      req.session.userId = undefined;
      res.ok();
  }

};

