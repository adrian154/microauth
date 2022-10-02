const {Clients, AuthCodes, AccessTokens} = require("../../data");
const config = require("../../../config.json");

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

    // auth client
    const authHeader = req.header("Authorization");
    let clientId, clientSecret;
    if(authHeader) {

        const authHeaderParts = authHeader.split(' ');
        if(authHeaderParts.length != 2 || authHeaderParts[0] != "Basic") {
            res.status(400).json({error: "invalid_request", error_description: 'Malformed authorization header or unsupported scheme'});
            return;
        }

        [clientId, clientSecret] = Buffer.from(authHeaderParts[1], "base64").split(":");

    } else if(req.body.client_id && req.body.client_secret) {
        clientId = req.body.client_id;
        clientSecret = req.body.client_secret;
    } else {
        res.status(400).json({error: "invalid_request", error_description: "Unknown or unsupported authentication method"});
        return;
    }

    if(!clientId) {
        res.status(400).json({error: "invalid_request", error_description: "Missing client ID"});
        return;
    } 

    if(!clientSecret) {
        res.status(400).json({error: "invalid_request", error_description: "Missing client secret"});
        return;
    } 

    const client = Clients.get(clientId);
    if(clientSecret != client?.secret) {
        res.status(401).json({error: "invalid_client"});
        return;
    }

    const authCode = AuthCodes.get(req.body.code, client.id);
    if(!authCode || authCode.expiresTimestamp < Date.now()) {
        res.status(401).json({error: "invalid_grant"});
        return;
    }
    AuthCodes.delete(req.body.code);

    if(!Clients.isAllowedCallback(client.id, req.body.redirect_uri)) {
        res.status(400).json({error: "invalid_request", error_description: "The requested redirect URI is not in the list of allowed callbacks"});
        return;
    }

    const accessToken = AccessTokens.get(authCode.accessToken);

    res.json({
        access_token: authCode.accessToken,
        token_type: "Bearer",
        expires_in: config.accessTokenLifespan,
        scope: accessToken.grantedScopes,
        id_token: authCode.idToken
    });

};