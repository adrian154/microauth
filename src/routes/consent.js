const consentTemplate = require("../templates/consent");

module.exports = async (req, res) => {
    
    if(req.method === "GET") {
        res.send(consentTemplate({asid: req.authState.id, email: req.authState.user.email, clientName: req.authState.authRequest.client.friendlyName}));
    } else {

    }

};