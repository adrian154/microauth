const {Users} = require("./src/data");
const {generateShortId, hashPassword} = require("./src/crypto-helper");
const [email, password] = process.argv.slice(2);
hashPassword(password).then(({salt, hash}) => {
    Users.add({
        id: generateShortId(),
        email,
        salt: salt.toString("base64"),
        passwordHash: hash.toString("base64"),
        isAdmin: 0
    });
});