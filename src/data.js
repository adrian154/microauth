const Database = require("better-sqlite3");
const Table = require("./crud");
const db = new Database("microauth.db");
db.pragma("foreign_keys = ON");

const clientsTable = new Table(db, "clients", [
    "clientId STRING PRIMARY KEY",
    "clientSecret STRING PRIMARY KEY",
    "friendlyName STRING NOT NULL",
]);

const allowedCallbacksTable = new Table(db, "allowedCallbacks", [
    "clientId STRING NOT NULL",
    "url STRING NOT NULL",
    "PRIMARY KEY (clientId, url)",
    "FOREIGN KEY (clientId) REFERENCES clients(clientId)"
]);

const Clients = {
    get: clientsTable.select("*").where("clientId = ?").fn(),
    isAllowedCallback: allowedCallbacksTable.select("*").where("clientId = ? AND url = ?").fn()
};

module.exports = {Clients, AllowedCallbacks};