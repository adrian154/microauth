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

    const callbacks = clone.querySelector(".callbacks"),
          newCallback = clone.querySelector(".callback");

    const addCallback = callback => {
        const li = document.createElement("li");
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.textContent = "\u00d7";
        li.append(callback, " ", deleteButton);
        callbacks.prepend(li);
        deleteButton.addEventListener("click", () => {
            if(confirm(`Are you sure you want to delete the callback "${callback}" from ${client.friendlyName}?`)) {
                fetch(`/management-api/clients/${encodeURIComponent(client.id)}/callbacks/${encodeURIComponent(callback)}`, {
                    method: "DELETE"
                }).then(resp => {
                    if(resp.ok) {
                        li.remove();
                    } else {
                        alert("Failed to remove callback");
                    }
                });
            }
        });
    };

    for(const callback of client.callbacks) {
        addCallback(callback);
    }

    // add callback logic
    clone.querySelector(".new-callback").querySelector("button").addEventListener("click", () => {
        fetch(`/management-api/clients/${encodeURIComponent(client.id)}/callbacks/${encodeURIComponent(newCallback.value)}`, {
            method: "PUT"
        }).then(resp => {
            if(resp.ok) {
                addCallback(newCallback.value);
            } else {
                alert("Failed to add callback");
            }
        });
    });

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

addClientDialog.querySelector("form").addEventListener("submit", event => {
    event.preventDefault();
    fetch("/management-api/clients", {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({name: document.getElementById("new-client-name").value})
    }).then(resp => {
        if(resp.ok) {
            location.reload();
        } else {
            alert("Failed to add client");
        }
    }).catch(err => alert(err.message));
});