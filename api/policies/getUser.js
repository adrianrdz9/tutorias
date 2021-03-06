const bcrypt = require('bcrypt');

module.exports = async function(req, res, next){
    //Defaults an user to prevent errors
    res.locals.user = null;
    res.locals.notificationsChannel = null;
    if(req.session.userId){
        //Send user object to the view (only the name)
        const user = await User.findOne({id: req.session.userId});
        if(user !== undefined){
            res.locals.notificationsChannel = `${user.id}-${user.createdAt}`;
            res.locals.user = _.pick(user, ['name', 'is_tutor']);
            res.locals.user.is_admin = await User.is_admin(user);
            req.session.user = user;

        }
    }

    next();
}
