const crypto = require("crypto");

const header = Buffer.from(JSON.stringify({
    alg: "HS256",
    typ: "JWT"
}), "utf-8").toString("base64url");


module.exports = (payload, secret) => {
    payload = Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url");
    const signature = crypto.createHmac("sha256", secret).update(header + "." + payload).digest("base64url");
    return header + "." + payload + "." + signature;
};