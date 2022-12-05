const consentTemplate = require("../templates/consent");

module.exports = async (req, res) => {
    res.send(consentTemplate({
        asid: req.authState.id, 
        email: req.authState.user.email,
        clientName: req.authState.authRequest.client.friendlyName,
        logo: req.authState.authRequest.client.logoUrl
    }));
};