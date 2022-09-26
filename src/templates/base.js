const { img, h1 } = require("html-generator");
const config = require("../../config.json");
const empty = require("./empty");

module.exports = (props, bodyContent) => empty(props, [
    img({id: "logo", src: config.tenant.logoUrl}),
    h1(props.title),
    bodyContent
]);