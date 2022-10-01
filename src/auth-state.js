const {generateId} = require("./crypto-helper");
const config = require("../config.json");

const states = {};

setInterval(() => {
    for(const id in states) {
        if(states[id].expiresAt < Date.now()) {
            delete states[id];
        }
    }
}, config.dbCleanupInterval);

module.exports = {
    begin: properties => {
        const id = generateId();
        states[id] = {properties, expiresAt: Date.now() + config.authStates.maxAge * 1000};
        return id;
    },
    get: id => {
        const session = states[id];
        if(session) {
            if(session.expiresAt < Date.now()) {
                delete states[id];
            } else {
                return session.properties;
            }
        }
    },
    end: id => {
        delete states[id];
    }
};