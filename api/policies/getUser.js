module.exports = async function(req, res, next){
    //Defaults an user to prevent errors
    res.locals.user = null;

    if(req.session.userId){
        //Send user object to the view (only the name)
        const user = await User.find({
            where: {id: req.session.userId},
            select: ['name']
        }).limit(1);
        if(user[0] !== undefined) res.locals.user = user[0];
    }

    next();
}