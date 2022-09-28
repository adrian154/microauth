const {Clients, AuthCodes} = require("../data");

module.exports = (req, res) => {
    
    if(!req.body.redirect_uri) {
        res.status(400).json({error: "invalid_request", error_description: 'Missing request parameter "redirect_uri"'});
        return;
    }

    if(req.body.grant_type !== "authorization_code") {
        res.status(400).json({error: "invalid_grant", error_description: 'grant_type must be "authorization_code"'});
        return;
    }

    if(!req.body.code) {
        res.status(400).json({error: "invalid_request", error_description: 'Missing request parameter "code"'});
        return;
    }

    const authCode = AuthCodes.get(req.body.code);
    if(!authCode) {
        res.status(400).json({error: "invalid_grant"});
        return;
    }

    // auth client
    

    if(!req.body.client_id) {
        res.status(400).json({error: "invalid_client", error_description: 'Missing request parameter "client_id"'})
        return;
    }

    if(req.body.client_id !== authCode.clientId) {
        res.status(400).json({error: "invalid_grant"});
        return;
    }

    if(!Clients.isAllowedCallback(clientId, req.body.redirect_uri)) {
        res.status(400).json({error: "invalid_request", error_description: "The requested redirect URI is not in the list of allowed callbacks"});
        return;
    }

    if(!req.query.client_secret) {
        res.status(400).json({error: "invalid_client", error_description: 'Missing request parameter "client_secret"'})
        return;
    }

    const client = Clients.get(req.query.client_id);
    if(req.query.client_secret != client?.clientSecret) {
        res.status(400).json({error: "invalid_client"});
        return;
    }

    // generate JWT
    

    // issue authorization code

};