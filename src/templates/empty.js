const { html, head, meta, title, link, body, main} = require("html-generator");
const config = require("../../config.json");

module.exports = (props, bodyContent) => "<!DOCTYPE html>" + html(
    head(
        meta({charset: "utf-8"}),
        meta({name: "viewport", content: "width=device-width, initial-scale=1"}),
        meta({name: "robots", content: "noindex, nofollow"}),
        title(props.title + " - " + config.tenant.friendlyName),
        props.manage ?
            link({rel: "stylesheet", href: "/stylesheets/manage.css"})
        :
            link({rel: "stylesheet", href: "/stylesheets/all.css"}),
        props.stylesheet && link({rel: "stylesheet", href: props.stylesheet})
    ),
    body(
        main(bodyContent)
    )
).html;