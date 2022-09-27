const { form, input, p, span, div, label, a, button } = require("html-generator");
const base = require("./base");

module.exports = props => base({title: "Log In", stylesheet: "/stylesheets/login.css"}, [
    form({action: `/login?asid=${props.asid}`, method: "post", class: props?.error ? "error" : ""},
        div({class: "field"},
            input({
                type: "text",
                id: "email",
                spellcheck: "false",
                autocapitalize: "none",
                autocomplete: "username",
                name: "email",
                required: null
            }),
            label({for: "email"}, "Email address")
        ),
        div({class: "field", style: "margin-bottom: 0"},
            input({
                type: "password",
                id: "password",
                spellcheck: "false",
                autocapitalize: "none",
                autocomplete: "current-password",
                name: "password",
                required: null
            }),
            label({for: "password"}, "Password")
        ),
        span({id: "error"}, props?.error),
        p({style: "margin: 0.5em 0"},
            input({type: "checkbox", id: "remember-me", name: "remember-me"}),
            label({for: "remember-me"}, "Remember Me"),
            a({href: "#", id: "forgot-password"}, "Forgot password?")
        ),
        button({type: "Submit"}, "Next"),
        p("Don't have an account? ", a({href: "#"}, "Sign up"))
    )
]);