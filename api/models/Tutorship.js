/**
 * Tutorship.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    max: {
      type: 'number',
      defaultsTo: 1
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    subject: {
      model: 'subject',
      required: true
    },

    owner: {
      model: 'user',
      required: true
    },

    users: {
      collection: 'user',
      via: 'tutorships'
    },

    horaries: {
      collection: 'horary',
      via: 'tutorship'
    },

    requests: {
      collection: 'TutorshipRequest',
      via: 'tutorshipRequested'
    }

  },

  is_available: async function(opts){
    let tutorship = await Tutorship.find({id: opts.id}).limit(1).populate('users');
    tutorship = tutorship[0];
    if(tutorship.users === undefined){
      tutorship.users = [];
    }
    return (tutorship.max - tutorship.users.length ) > 0;
  }

};

