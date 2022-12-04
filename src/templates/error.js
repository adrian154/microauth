const { p, div, b, code } = require("html-generator");
const base = require("./base");

module.exports = errorMessage => base({title: "Error", stylesheet: "/stylesheets/error.css"}, [
    p("Something went wrong, and your request couldn't be completed. Please try again."),
    div({id: "technical-details"},
        p(b("Technical Details")),
        code({id: "message"}, errorMessage)
    )
]);