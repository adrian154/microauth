const {AccessTokens, AuthCodes} = require("../data");
const {generateId} = require("../crypto-helper");
const config = require("../../config.json");
const getClaims = require("../get-claims");
const createJwt = require("../jwt");

module.exports = (req, res) => {

    const authRequest = req.authState.authRequest;

    // generate JWT
    const iat = Math.floor(Date.now() / 1000);
    const {claims, grantedScopes} = getClaims(req.authState.user, authRequest.scopes);
    
    claims.iss = config.urlBase;
    claims.aud = authRequest.client.id;
    claims.iat = iat;
    claims.exp = iat + config.idTokenLifespan;
    claims.auth_time = req.session.lastAuthTimestamp;

    if(authRequest.nonce) {
        claims.nonce = authRequest.nonce;
    }

    const idToken = createJwt(claims, authRequest.client.secret);
    const accessToken = generateId();
    const authCode = generateId();

    // generate access token
    AccessTokens.add({
        id: accessToken,
        expiresTimestamp: Date.now() + config.accessTokenLifespan,
        grantedScopes: grantedScopes.join(" ")
    });

    // generate authorization code
    AuthCodes.add({
        id: authCode,
        clientId: authRequest.client.id,
        expiresTimestamp: Date.now() + config.authCodeLifespan,
        accessToken,
        idToken
    });

    // redirect user back to client
    authRequest.callbackUrl.searchParams.set("code", authCode);
    if(authRequest.state) {
        authRequest.callbackUrl.searchParams.set("state", authRequest.state);
    }

    res.redirect(authRequest.callbackUrl);

};