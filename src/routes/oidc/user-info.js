const {getClaims} = require("../../get-claims");
const {Users} = require("../../data");

module.exports = (req, res) => {
    const user = Users.getById(req.accessToken.userId);
    res.json(getClaims(user, req.accessToken.grantedScopes.split(" ")).claims);
};