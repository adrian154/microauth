const {supportedScopes} = require("../../get-claims");
const config = require("../../../config.json");

module.exports = (req, res) => res.json({
    issuer: config.urlBase,
    authorization_endpoint: new URL("/authorize", config.urlBase),
    token_endpoint: new URL("/token", config.urlBase),
    userinfo_endpoint: new URL("/userinfo", config.urlBase),
    jwks_uri: new URL("/jwks", config.urlBase),
    scopes_supported: supportedScopes,
    response_types_supported: ["code"],
    response_modes_supported: ["query"],
    grant_types_supported: ["authorization_code"],
    id_token_signing_alg_values_supported: ["HS256"],
    token_endpoint_auth_methods_supported: ["client_secret_basic"],
    claim_types_supported: ["aud", "email", "email_verified", "name", "iat", "iss", "sub"]
});