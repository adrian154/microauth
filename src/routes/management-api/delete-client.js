const {Clients} = require("../../data");

module.exports = (req, res) => {
    Clients.delete(req.params.clientId);
    res.sendStatus(200);
};