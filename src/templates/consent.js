const { form, p, a, button, b } = require("html-generator");
const base = require("./base");

module.exports = props => base({title: `Continue to ${props.clientName}`}, [
    form({action: `/finish?asid=${props.asid}`, method: "get"},
        p(`You are about to sign in to ${props.clientName} as `, b(props.email), "."),
        p("Wrong account? ", a({href: "#"}, "Sign in as another user")),
        form({action: "/consent", method: "POST"},
            button({type: "submit"}, "Continue")
        )
    )
]);