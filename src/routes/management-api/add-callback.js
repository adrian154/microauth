const {Clients} = require("../../data");

module.exports = (req, res) => {
    try {
        const url = new URL(req.params.callback); // check if URL is valid
        Clients.addCallback({clientId: req.params.clientId, url: req.params.callback});
        res.sendStatus(200);
    } catch(err) {
        res.sendStatus(400);
    }
};