// Require an access token for a protected resource
const {AccessTokens} = require("../data");

module.exports = scope => (req, res, next) => {
    
    const authHeader = req.header("Authorization");
    let token;

    if(authHeader) {

        const authHeaderParts = authHeader.split(" ");
        if(authHeaderParts.length != 2) {
            res.status(400).json({error: "Malformed Authorization header"}).send();
            return;
        }

        if(authHeaderParts[0] !== "Bearer") {
            res.status(400).json({error: "Authorization method must be Bearer"}).send();
            return;
        }

        token = authHeaderParts[1];

    } else if(req.body.access_token) {
        token = req.body.access_token;
    } else if(req.query.access_token) {
        token = req.query.access_token;
    } else {
        res.status(400).header("WWW-Authenticate", 'error="invalid_request" error_description="Unknown or unsupported authentication method"').send();
        return;
    }

    const accessToken = AccessTokens.get(token);
    if(!accessToken) {
        res.status(400).header("WWW-Authenticate", 'error="invalid_token" error_description="Token is expired or invalid"').send();
        return;
    }

    req.accessToken = accessToken;
    if(!accessToken.grantedScopes.split(" ").includes(scope)) {
        res.sendStatus(401).header("WWW-Authenticate", `error="insufficient_scope" error_description="The provided access token is not authorized to access scope ${scope}"`).send();
        return;
    }

    next();

};