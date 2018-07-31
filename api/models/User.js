/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt');

function hashPassword(password, cb){
  bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(password, salt, function(err, hash){
      if(err){
        sails.log(err);
        return cb(err);
      }
      password = hash;
      return cb(null, password);
    })
  })
}

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    account_number: {
      type: 'number',
      required: true,
      unique: true,
      min: 312000000,
      max: 319999999
    },

    name: {
      type: 'string',
      required: true,
    },

    password: {
      type: 'string',
      required: true
    },

    is_tutor: {
      type: 'boolean',
      defaultsTo: false
    },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    classes: {
      collection: 'horary',
      via: 'users'
    },

    tutorOf: {
      collection: 'tutorship',
      via: 'owner'
    },

    tutorshipRequests: {
      collection: 'TutorshipRequest',
      via: 'requestor'
    },
    
    notifications: {
      collection: 'notification',
      via: 'user'
    },


  },

  beforeCreate: function(user, done){
    hashPassword(user.password, function(err, hash){
      if(err){
        return done(err);
      }
      user.password = hash;
      done();
    })
  }, 

  beforeUpdate: function(user, done){
    if(user.password){
      hashPassword(user.password, function(err, hash){
        if(err){
          return done(err);
        }
        user.password = hash;
        done();
      })
    }else{
      done();
    }
  },

  is_admin: async function(opts){
    const user = await User.findOne({id: opts.id});
    if(user){
      return user.account_number === 312000000;
    }

    return false;
  }

};

