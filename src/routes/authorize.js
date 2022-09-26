const errorTemplate = require("../templates/error");
const {Clients} = require("../data");

const KNOWN_RESPONSE_MODES = ["query", "fragment"];

const getRequestParams = params => {

    if(!req.query.scope) {
        return {error: 'Missing request parameter "scope"'};
    }    

    const scopes = req.query.scope.split(" ");
    if(!scopes.includes("openid")) {
        return {error: 'Requested scopes did not include "openid"'};
    }

    if(!req.query.response_type) {
        return {error: 'Missing request parameter "response_type"'};
    }

    if(req.query.response_type !== "code") {
        return {error: `Unsupported response_type "${req.query.response_type}"`};
    }

    if(!req.query.client_id) {
        return {error: 'Missing request parameter "client_id"'};
    }

    const clientId = req.query.client_id;
    const client = Clients.get(clientId);
    if(!client) {
        return {error: 'Unknown client'};
    }

    if(!req.query.redirect_uri) {
        return {error: 'Missing request parameter "redirect_uri"'};
    }

    const redirectUri = req.query.redirect_uri;
    if(!Clients.isAllowedCallback(clientId, redirectUri)) {
        return {error: "The requested redirect URI is not in the list of allowed callbacks"};
    }

    // ignore unknown response modes
    const responseMode = KNOWN_RESPONSE_MODES.includes(req.query.response_mode) ? req.query.response_mode : "query";
    const nonce = req.query.nonce;

    if(req.query.redirectUri) {
        return {error: 'Unsupported parameter "prompt"'};
    }

};

module.exports = (req, res) => {

};