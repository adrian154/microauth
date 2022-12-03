const authStates = require("../auth-state");

module.exports = (req, res, next) => {
    if(!req.session) {
        const authState = {
            stage: "start",
            internal: true,
            redirect: req.originalUrl
        };
        authStates.begin(authState);
        res.redirect(authState.getNextUrl());
    } else if(!req.session.user.isAdmin) {
        res.sendStatus(401);
    } else {
        next();
    }
};