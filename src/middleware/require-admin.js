module.exports = (req, res, next) => {
    if(req.session?.user.isAdmin) {
        next();
    } else {
        res.sendStatus(401);
    }
};