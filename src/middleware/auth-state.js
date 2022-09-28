// Middleware to attach authState variable to requests
const AuthStates = require("../auth-state");

module.exports = (req, res, next) => {
    if(req.query.asid) {
        req.authState = AuthStates.get(req.query.asid);
    }
    next();
};