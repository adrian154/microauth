const errorTemplate = require("../templates/error");
const authStates = require("../auth-state")
const {Clients} = require("../data");

const RESPONSE_MODES = ["query", "fragment"];

const readRequestParams = params => {

    if(!params.scope) {
        throw new Error('Missing request parameter "scope"');
    }

    const scopes = params.scope.split(" ");
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

    if(params.response_mode && !RESPONSE_MODES.includes(params.response_mode)) {
        throw new Error(`Unsupported response_mode "${params.response_mode}"`);
    }

    const responseMode = params.response_mode || "query";

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
        redirectUri,
        state: params.state,
        responseMode,
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
        stage: "start",
        getNextUrl: () => {
            switch(authState.stage) {
                case "start": return `/login?asid=${authState.id}`;
                case "consent": return `/consent?asid=${authState.id}`;
            }
        }
    };

    const authStateId = authStates.begin(authState);
    authState.id = authStateId;

    const needsReauth = !isNaN(authRequest.max_age) && Date.now() - req.session.createdTime > authRequest.max_age * 1000 || authRequest.prompt.includes("login")

    // if the user isn't signed in and the client has requested that we do not prompt, indicate that authorization failed
    if((!req.session || needsReauth) && authRequest.prompt.includes("none")) {
        const callbackUrl = new URL(authRequest.redirectUri);
        callbackUrl.searchParams.set("error", "login_required");
        res.redirect(callbackUrl);
        return;
    }
    
    // if the user is already signed in, jump ahead to consent if the client has not requested re-authentication;
    if(req.session && !needsReauth) {
        authState.stage = "consent";
        authState.user = req.session.user;
    }

    res.redirect(authState.getNextUrl());

};