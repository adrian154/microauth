const cryptoHelper = require("../../crypto-helper");
const {Clients} = require("../../data");

module.exports = (req, res) => {
    const secret = cryptoHelper.generateId();
    Clients.updateSecret({
        id: req.params.clientId,
        secret
    });
    res.json(secret);
};