// Check if user has correct access for admin-only pages; redirect to login if necessary.
const authStates = require("../auth-state");

module.exports = (req, res, next) => {
    if(!req.session) {
        const authState = {
            stage: "start",
            internalRedirect: req.originalUrl
        };
        authStates.begin(authState);
        res.redirect(authState.getNextUrl());
    } else if(!req.session.user?.isAdmin) {
        res.sendStatus(401);
    } else {
        next();
    }
};