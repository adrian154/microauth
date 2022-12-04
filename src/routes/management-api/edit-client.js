const {Clients} = require("../../data");

module.exports = (req, res) => {
    
    const name = String(req.body.name),
          logoUrl = String(req.body.logoUrl) || "";

    if(!name) {
        return res.sendStatus(400);
    }

    if(logoUrl) {
        try {
            new URL(logoUrl);
        } catch(err) {
            return res.sendStatus(400);
        }
    }

    Clients.update({
        id: req.params.clientId,
        name,
        logoUrl
    });

    res.sendStatus(200);

};