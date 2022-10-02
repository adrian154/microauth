const cookieParser = require('cookie-parser');
const express = require("express");
const app = express();

const config = require("../config.json");

if(config.trustProxy) {
    app.enable("trust proxy");
}

app.use((req, res, next) => {
    res.header("X-Content-Type-Options", "nosniff")
       .header("Referrer-Policy", "no-referrer")
       .header("X-Frame-Options", "DENY");
    next();
});

app.use(express.static("static"));

app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use(require("./middleware/session"));
app.use(require("./middleware/auth-state"));

// FIXME: OIDC spec says authorize endpoint must support both GET and POST
app.get("/authorize", require("./routes/oidc/authorize"));
app.post("/token", require("./routes/oidc/get-token"));
app.get("/userinfo", require("./middleware/oauth")("openid"), require("./routes/oidc/user-info"));
app.get("/.well-known/openid-configuration", require("./routes/oidc/discovery-document"));

app.get("/login", require("./routes/login"));
app.post("/login", require("./routes/login"));
app.get("/consent", require("./middleware/auth-stage")("consent"), require("./routes/consent"));
app.get("/finish", require("./middleware/auth-stage")("consent"), require("./routes/finish"));

app.get("/management-api/clients", require("./routes/management-api/clients"));

// we don't support RS256 signing (even though it's required by the spec), so return an empty list of keys
app.get("/jwks", (req, res) => res.json([]));

app.use((req, res, next) => {
    res.status(404).send("Not found");
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Internal server error");
});

app.listen(config.port, () => console.log("Listening"));