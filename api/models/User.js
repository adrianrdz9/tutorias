/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt');

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
    tutorships: {
      collection: 'tutorship',
      via: 'users'
    },

    tutorOr: {
      collection: 'tutorship',
      via: 'owner'
    }

  },

  beforeCreate: function(user, done){
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(user.password, salt, function(err, hash){
        if(err){
          sails.log(err);
          return done(err);
        }
        user.password = hash;
        return done();
      })
    })
  },

  is_admin: async function(opts){
    const user = await User.findOne({id: opts.id});
    if(user){
      return user.account_number === 312000000;
    }

    return false;
  }

};

