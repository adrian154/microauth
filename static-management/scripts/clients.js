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

const addClientDialog = document.getElementById("add-client");
document.getElementById("add-button").addEventListener("click", () => addClientDialog.showModal());
document.querySelector(".close-button").addEventListener("click", event => event.target.closest("dialog").close());

document.getElementById("new-client-callbacks").addEventListener("input", event => {
    try {
        const urls = event.target.value.split('\n');
        if(urls.length == 0) {
            throw new Error();
        }
        for(const url of urls) {
            new URL(url);
        }
        event.target.setCustomValidity("");
    } catch(error) {
        event.target.setCustomValidity("Callbacks must be a list of valid URLs");
        event.target.reportValidity();
    }
});

addClientDialog.querySelector("form").addEventListener("submit", event => {
    event.preventDefault();
    fetch("/management-api/clients", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({
            name: document.getElementById("new-client-name").value,
            callbacks: document.getElementById("new-client-callbacks").value.split("\n")
        })
    }).then(resp => {
        if(resp.ok) {
            location.reload();
        } else {
            alert("Failed to add client");
        }
    }).catch(err => alert(err.message));
});