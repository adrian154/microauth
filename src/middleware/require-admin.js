// Block access to privileged APIs.
module.exports = (req, res, next) => {
    if(req.session?.user.isAdmin) {
        next();
    } else {
        res.sendStatus(401);
    }
};