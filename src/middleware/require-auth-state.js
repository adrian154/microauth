const errorTemplate = require("../templates/error");

module.exports = stage => (req, res, next) => {
    
    if(!req.authState) {
        res.status(400).send(errorTemplate("Your session has expired. Please try to log in again."));
        return;
    }
    
    if(req.authState.stage != stage) {
        res.redirect(req.authState.getNextUrl());
        return;
    }

    next();

};