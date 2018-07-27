/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const passport = require('passport');

module.exports = {
  login: function (req, res) {
    sails.log('Login');
    passport.authenticate('local', (err, user, info) => {
      if (err || !user) {
        return res.send({
          message: info.message,
          user
        });
      }

      req.logIn(user, (err) => {
        if (err) {res.send(err);}
        return res.send({
          message: info.message,
          user
        });
      });
    })(req, res);
  },

  logout: function (req, res) {
    req.logout();
    res.redirect('/');
  },

  signup: async function (req, res) {
    try {
      await User.create({
        account_number: req.body.account_number,
        password: req.body.password,
        name: req.body.name,
        last_name: req.body.last_name
      });
    } catch (err) {
      return res.send(err);
    }

    return res.redirect('/');
  }

};
