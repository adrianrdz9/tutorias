/**
 * NotificationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    // GET /notifications
    index: async function(req, res){
        // Return current user notifications
        return res.json(await Notification.find({user: req.session.userId}));
    }, 

};

