const {generateId} = require("./crypto-helper");
const config = require("../config.json");
const {Sessions} = require("./data");

module.exports = (req, res, rememberMe) => {

    if(req.session) {
        Sessions.renewAuthTimestamp(req.session.id);        
    } else {
        const id = generateId();
        Sessions.add({
            id,
            userId: req.authState.user.id,
            initiatorAddr: req.ip,
            createdTimestamp: Date.now(),
            expiresTimestamp: Date.now() + (rememberMe ? config.sessions.rememberMeMaxAge : config.sessions.maxAge) * 1000,
            lastAuthTimestamp: Date.now()
        });
        res.cookie("session", id, {
            httpOnly: true,
            secure: true,
            expires: rememberMe ? new Date(Date.now() + config.sessions.rememberMeMaxAge * 1000) : null 
        });
    }

};