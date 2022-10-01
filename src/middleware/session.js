const {Users, Sessions} = require("../data");

module.exports = (req, res, next) => {
    if(req.cookies.session) {
        const session = Sessions.get(req.cookies.session);
        if(session) {
            if(session.expiresTimestamp < Date.now()) {
                Sessions.delete(session.id);
            } else {
                req.session = session;
                req.session.user = Users.getById(session.userId);
            }
        }
    }
    next();
};