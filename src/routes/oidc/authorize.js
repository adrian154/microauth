const errorTemplate = require("../../templates/error");
const {supportedScopes} = require("../../get-claims");
const authStates = require("../../auth-state");
const {Clients} = require("../../data");

const readRequestParams = params => {

    if(!params.scope) {
        throw new Error('Missing request parameter "scope"');
    }

    const scopes = params.scope.split(" ").filter(scope => supportedScopes.includes(scope));
    if(!scopes.includes("openid")) {
        throw new Error('Requested scopes did not include "openid"');
    }

    if(!params.response_type) {
        throw new Error('Missing request parameter "response_type"');
    }

    if(params.response_type !== "code") {
        throw new Error(`Unsupported response_type "${params.response_type}"`);
    }

    if(!params.client_id) {
        throw new Error('Missing request parameter "client_id"');
    }

    const client = Clients.get(params.client_id);
    if(!client) {
        throw new Error("Unknown client");
    }

    if(!params.redirect_uri) {
        throw new Error('Missing request parameter "redirect_uri"');
    }

    const redirectUri = params.redirect_uri;
    if(!Clients.isAllowedCallback(client.id, redirectUri)) {
        throw new Error("The requested redirect URI is not in the list of allowed callbacks");
    }

    const callbackUrl = new URL(redirectUri);

    if(params.request) {
        callbackUrl.searchParams.set("error", "request_not_supported");
        res.redirect(callbackUrl);
        return;
    }

    if(params.request_uri) {
        callbackUrl.searchParams.set("error", "request_uri_not_supported");
        res.redirect(callbackUrl);
        return;
    }

    if(params.registration) {
        callbackUrl.searchParams.set("error", "registration_not_supported");
        res.redirect(callbackUrl);
        return;
    }

    if(params.response_mode && params.response_mode !== "query") {
        throw new Error(`Unsupported response_mode "${params.response_mode}"`);
    }

    const prompt = params.prompt?.split(" ") || [];
    if(prompt.includes("none") && prompt.length > 1) {
        throw new Error('prompt field may not contain "none" with other values');
    }

    let maxAge;
    if(params.max_age) {
        maxAge = Number(params.max_age);
        if(isNaN(maxAge)) {
            throw new Error("Invalid max_age");
        }
    }

    return {
        scopes,
        client,
        callbackUrl,
        state: params.state,
        nonce: params.nonce,
        prompt,
        maxAge
    };

};

module.exports = (req, res) => {

    let authRequest;
    try {
        authRequest = readRequestParams(req.query);
    } catch(err) {
        res.status(400).send(errorTemplate(err.message));
        return;
    }

    // begin auth session
    const authState = {
        authRequest,
        user: null,
        stage: "start"
    };

    const authStateId = authStates.begin(authState);
    authState.id = authStateId;

    const authNeeded = !req.session ||
                       authRequest.prompt.includes("login") ||
                       !isNaN(authRequest.max_age) && Date.now() - req.session.lastAuthTimestamp > authRequest.max_age * 1000;

    if(authNeeded && authRequest.prompt.includes("none")) {
        callbackUrl.searchParams.set("error", "login_required");
        res.redirect(callbackUrl);
        return;
    }
    
    if(!authNeeded) {
        authState.stage = "consent";
        authState.user = req.session.user;
    }

    res.redirect(authState.getNextUrl());

};