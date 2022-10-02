const {Clients} = require("../../data");

module.exports = (req, res) => res.json(Clients.getAll().map(client => {
    client.callbacks = Clients.getCallbacks(client.id);
    return client;
}));