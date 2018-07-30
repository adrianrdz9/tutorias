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

    horaries: {
      collection: 'horary',
      via: 'tutorship'
    },


  },

  has_any_available: async function(opts){
  
    let tutorship = await Tutorship.find({id: opts.id}).limit(1).populate('horaries');
    tutorship = tutorship[0];
    let available = false
    for (horary of tutorship.horaries) {
      if(Horary.is_available(horary)){
        available = true;
      }
    }
    return available;
  },

  available_horaries: async function(opts){
    let availables = [];

    let tutorship = await Tutorship.find({id: opts.id}).limit(1).populate('horaries');
    tutorship = tutorship[0];

    for (horary of tutorship.horaries) {
      if(Horary.is_available(horary)){
        availables.push(horary);
      }
    }

    return availables;

  }



};

