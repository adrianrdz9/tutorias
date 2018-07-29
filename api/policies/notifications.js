module.exports = async function(req, res, next){
    if(req.session.userId !== undefined){
        let notifications = await Notification.find({
            user: req.session.userId
        });

        res.locals.notifications = notifications;
    }

    next();
    
}