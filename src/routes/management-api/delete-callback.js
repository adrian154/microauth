const {Clients} = require("../../data");

module.exports = (req, res) => {
    Clients.deleteCallback(req.params.clientId, req.params.callback);
    res.sendStatus(200);
};