/**
 * TutorshipRequest.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    status: {
      type: 'number', // 0 -> Request sent, 1 -> Request accepted, 2 -> Request rejeted 
      defaultsTo: 0
    },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    requestor: {
      model: 'user'
    },

    horary: {
      model: 'horary'
    },

    

  },

  beforeCreate: async function(request, next){
    const horary = await Horary.findOne({id: request.horary});
    const requestor = await User.findOne({id: request.requestor});
    const tutorship = await Tutorship.findOne({id: horary.tutorship});

    const linkTo = "/tutorships/manage";

    const requestToId = tutorship.owner;
    await Notification.create({
      user: requestToId,
      title: requestor.name + " ha solicitado unirse a una de tus tutorias",
      linkTo: linkTo
    })
    next();
  },

};

