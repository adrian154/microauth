const cookieParser = require('cookie-parser');
const express = require("express");
const app = express();

const config = require("../config.json");

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

// This is the endpoint that clients are redirected to at the beginning of an authentication request.
// FIXME: OIDC spec says we must support both GET and POST for this endpoint
app.get("/authorize", require("./routes/authorize"));
app.get("/login", require("./middleware/require-auth-state")("start"), require("./routes/login"));
app.post("/login", require("./middleware/require-auth-state")("start"), require("./routes/login"));
app.get("/consent", require("./middleware/require-auth-state")("consent"), require("./routes/consent"));
app.get("/finish", require("./middleware/require-auth-state")("consent"), require("./routes/finish"));

app.listen(config.port, () => console.log("Listening"));