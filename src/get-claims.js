// Convert a user and a list of scopes to claims
module.exports = (user, scopes) => {
    
    const claims = {sub: user.id};
    const grantedScopes = ["openid"];

    if(scopes.includes("profile")) {
        grantedScopes.push("profile");
        claims.name = user.email;
        claims.preferred_username =  user.username;
    }

    if(scopes.includes("email")) {
        grantedScopes.push("email");
        claims.email = user.email;
        claims.email_verified = user.email;
    }

    return {claims, grantedScopes};

};