const cryptoHelper = require("../../crypto-helper");
const {Clients} = require("../../data");

module.exports = (req, res) => {
    
    const name = String(req.body.name);
    if(!name) {
        return res.sendStatus(400);
    }

    Clients.add({
        id: cryptoHelper.generateShortId(),
        secret: cryptoHelper.generateId(),
        friendlyName: name,
        logoUrl: null
    });
    res.sendStatus(200);

};