const errorTemplate = require("../templates/error");

module.exports = (req, res) => {

    if(!req.query.scope) {
        res.status(400).send(errorTemplate('Missing request parameter "scope"'));
        return;
    }    

    const scopes = req.query.scope.split(" ");

    if(!req.query.response_type) {
        res.status(400).send(errorTemplate('Missing request parameter "response_type"'));
        return;
    }

    if(req.query.response_type !== "code") {
        res.status(400).send(errorTemplate(`Unsupported response_type "${req.query.response_type}"`));
        return;
    }

    if(!req.query.client_id) {
        res.status(400).send(errorTemplate('Missing request parameter "client_id"'));
        return;
    }

    const clientId = req.query.client_id;

    

};