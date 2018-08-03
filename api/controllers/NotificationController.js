/**
 * NotificationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    index: async function(req, res){
        return res.json(await Notification.find({user: req.session.userId}));
    }, 

};

