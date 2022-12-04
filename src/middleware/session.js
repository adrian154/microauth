// Attach session variable to requests.
const {Users, Sessions} = require("../data");

module.exports = (req, res, next) => {
    if(req.cookies.session) {
        const session = Sessions.get(req.cookies.session);
        if(session) {
            req.session = session;
            req.session.user = Users.getById(session.userId);
        }
    }
    next();
};