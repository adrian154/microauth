const { p, a, button, b } = require("html-generator");
const base = require("./base");

module.exports = props => base({title: `Continue to ${props.clientName}`}, [
    p(`You are about to sign in to ${props.clientName} as `, b(props.email), "."),
    p("Wrong account? ", a({href: "#"}, "Sign in as another user")),
    a({href: `/finish?asid=${props.asid}`}, button({type: "submit"}, "Continue"))
]);