const express = require("express");
const app = express();

// OIDC spec says we must support both GET and POST for the authentication request endpoint, but we only support GET for now
app.use("/authorize", (req, res) => {

    if(!req.query.scope) {
        
    }

});