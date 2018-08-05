/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 const bcrypt = require('bcrypt');
 const moment = require("moment");

module.exports = {

  // POST /users/sign_up
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

  // GET /users/sign_up
  signupForm: function(req, res){
    //Display sign up form
    return res.view('users/sign_up')
  },

  // POST /users/login
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

  // GET /users/login
  loginForm: function(req, res){
    //Display login form
    return res.view('users/login')
  },

  // GET /users/update
  updateForm: async function(req, res){
    // Get current user data
    user = await User.find({id: req.session.userId}).limit(1);
    user = _.pick(user[0], ["name", "account_number", "is_tutor"]);
    // Show update form with current user data
    return res.view('users/update', {user});
  },

  // POST /users/update
  update: async function(req, res){
    //
    // ─── BUILD OBJECT WITH VALUES TO BE UPDATED ──────────────────────
    //
    var newData = {};
    if(req.body.name){
      newData.name = req.body.name;
    }

    // Validate password if the user wants to change it
    if(req.body.password){
      const match = await bcrypt.compareSync(req.body.old_password, req.session.user.password);
      if(match){
        if(req.body.password === req.body.password_confirmation){
          newData.password = req.body.password;
        }else{
          res.redirectF("/users/update", {error: "Las contraseñas no coinciden"});
        }
      }else{
        res.redirectF("/users/update", {error: "Contraseña incorrecta"})
      }
    }
    // ─────────────────────────────────────────────────────────────────

    if(req.body.is_tutor){
      //Once the user becomes tutor it cant be undone
      newData.is_tutor = true;
    }
    await User.update({id: req.session.userId}, newData)
    return res.redirectF('/', {success: ["Datos actualizados"]});
  },

  // DELETE /users
  logout: function(req, res){
      // Delete user session
      req.session.userId = undefined;
      res.ok();
  },

  // GET /users/calendar
  calendar: function(req, res){
    // Show the calendar
    return res.view('users/calendar');
  },

  // GET /events
  events: async function(req, res){
    //
    // ─── RETURN TUTORSHIP APPOINTMENTS WITHIN A DATE RANGE ─────────────
    //  
    const date = req.query.date.split('-');
    var events = await User.find({id: req.session.userId}).limit(1).populate("classes");
    events = events[0].classes;

    events = events.filter((el)=>{
      el = el.date.split('-');
      return el[0] === date[0] && el[1] === date[1]
    })

    for(i in events){
      var subject = await Tutorship.find({
        id: events[i].tutorship
      }).limit(1).populate("subject").populate("owner");

      // Build the message to be displayed
      var tutor = subject[0].owner.name;
      subject = subject[0].subject.title;

      var time = events[i].time;
      var place = events[i].place;

      events[i].title = subject;
      events[i].description = `Tutor: ${tutor}<br>Hora: ${time}<br>Lugar: ${place}`
    }
    // ─────────────────────────────────────────────────────────────────

    res.json(events)
  }

};

