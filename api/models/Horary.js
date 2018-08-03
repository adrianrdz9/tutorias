/**
 * Horary.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    date: {
      type: 'string',
      required: true
    },

    time: {
      type: 'string',
      required: true
    },

    max: {
      type: 'number',
      defaultsTo: 1
    },

    place: {
      type: 'string',
      defaultsTo: 'Biblioteca'
    },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    tutorship: {
      model: 'tutorship'
    },

    users: {
      collection: 'user',
      via: 'classes'
    },

    requests: {
      collection: 'tutorshipRequest',
      via: 'horary'
    }

  },

  is_available: async function(opts){
    let horary = await Horary.find({id: opts.id}).limit(1).populate('users');
    horary = horary[0];

    sails.log(horary);

    return (horary.max - horary.users.length) !== 0
  },

  available: async function(opts){
    let horary = await Horary.find({id: opts.id}).limit(1).populate('users');
    horary = horary[0];
    return horary.max - horary.users.length
  },

};

