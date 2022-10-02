const clientsList = document.getElementById("clients");
const clientTemplate = document.getElementById("client-template");

const addClient = client => {

    const clone = clientTemplate.content.cloneNode(true);
        
    const hidden = clone.querySelector(".client-hidden");
    const toggle = clone.querySelector(".toggle");
    toggle.addEventListener("click", () => {
        if(hidden.classList.toggle("shown")) {
            toggle.textContent = "\u2212";
        } else {
            toggle.textContent = "+";
        }
    });

    const title = clone.querySelector("h1");
    title.textContent = client.friendlyName;

    const callbacks = clone.querySelector("textarea");
    callbacks.textContent = client.callbacks.join("\n");

    clone.querySelector(".client-id").value = client.id;
    clone.querySelector(".client-secret").value = client.secret;
    clone.querySelector(".client-name").value = client.friendlyName;

    clientsList.append(clone);

};

fetch("/management-api/clients").then(req => req.json()).then(clients => {

    for(const client of clients) {
        addClient(client);
    }

});