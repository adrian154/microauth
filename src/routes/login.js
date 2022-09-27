const cryptoHelper = require("../util/crypto-helper");
const loginTemplate = require("../templates/login");
const {Users} = require("../data");

module.exports = async (req, res) => {

    if(req.method === "GET") {
        res.send(loginTemplate({asid: req.authState.id}));
    } else {

        if(!req.body.email || !req.body.password) {
            res.status(400).send(loginTemplate({asid: req.authState.id, error: 'Incomplete request'}));
            return;
        }

        const user = Users.getByEmail(req.body.email);
        if(!user) {
            res.status(400).send(loginTemplate({asid: req.authState.id, error: 'Wrong username or email'}));
            return;
        }

        if(!(await cryptoHelper.comparePassword(req.body.password, Buffer.from(user.passwordHash, "base64"), Buffer.from(user.salt, "base64")))) {
            res.status(400).send(loginTemplate({asid: req.authState.id, error: 'Wrong username or email'}));
            return;
        }

        req.authState.stage = "consent";
        req.authState.user = user;
        res.redirect(req.authState.getNextUrl());

    }

};