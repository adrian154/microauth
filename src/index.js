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

// This is the endpoint that clients are redirected to at the beginning of an authentication request.
// FIXME: OIDC spec says we must support both GET and POST for this endpoint
app.get("/authorize", require("./routes/authorize"));

app.listen(config.port, () => console.log("Listening"));