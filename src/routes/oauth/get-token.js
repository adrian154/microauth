const {Clients, AuthCodes} = require("../../data");

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
    const authHeader = req.getHeader("Authorization");
    if(!authHeader) {
        res.status(400).json({error: "invalid_request", error_description: 'Missing authorization header'});
        return;
    }

    const authHeaderParts = authHeader.split(' ');
    if(authHeaderParts.length != 2 || authHeaderParts[0] != "Basic") {
        res.status(400).json({error: "invalid_request", error_description: 'Malformed authorization header or unsupported scheme'});
        return;
    }

    const [clientId, clientSecret] = Buffer.from(authHeaderParts[1], "base64").split(":");
    if(!clientId || clientSecret) {
        res.status(400).json({error: "invalid_request", error_description: "Malformed authorization header"});
        return;
    } 

    const client = Clients.get(clientId);
    if(clientSecret != client?.secret) {
        res.status(400).json({error: "invalid_client"});
        return;
    }
    
    if(clientId !== authCode.clientId) {
        res.status(400).json({error: "invalid_grant"});
        return;
    }

    if(!Clients.isAllowedCallback(clientId, req.body.redirect_uri)) {
        res.status(400).json({error: "invalid_request", error_description: "The requested redirect URI is not in the list of allowed callbacks"});
        return;
    }

    res.json({
        access_token: null,
        token_type: "Bearer",
        expires_in: 86400,
        scope: "",
        state: ""
    });

};