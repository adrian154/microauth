const Database = require("better-sqlite3");
const config = require("../config.json");
const Table = require("./crud");

const db = new Database("data/microauth.db");
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

const usersTable = new Table(db, "users", [
    "id STRING PRIMARY KEY",
    "email STRING NOT NULL",
    "passwordHash STRING NOT NULL",
    "salt STRING NOT NULL"
]);

const clientsTable = new Table(db, "clients", [
    "id STRING PRIMARY KEY",
    "clientSecret STRING NOT NULL",
    "friendlyName STRING NOT NULL",
]);

const allowedCallbacksTable = new Table(db, "allowedCallbacks", [
    "clientId STRING NOT NULL",
    "url STRING NOT NULL",
    "PRIMARY KEY (clientId, url)",
    "FOREIGN KEY (clientId) REFERENCES clients(id)"
]);

const sessionsTable = new Table(db, "sessions", [
    "id STRING PRIMARY KEY",
    "userId STRING NOT NULL",
    "initiatorAddr STRING NOT NULL",
    "createdTimestamp INTEGER NOT NULL",
    "expiresTimestamp INTEGER NOT NULL",
    "FOREIGN KEY (userId) REFERENCES users(id)"
]);

// authorization codes
const authCodesTable = new Table(db, "authCodes", [
    "id STRING PRIMARY KEY",
    "clientId STRING NOT NULL",
    "expiresTimestamp INTEGER NOT NULL",
    "jwt STRING NOT NULL"
]);

const Users = {
    getById: usersTable.select("*").where("id = ?").fn(),
    getByEmail: usersTable.select("*").where("email = ?").fn()
};

const Clients = {
    get: clientsTable.select("*").where("id = ?").fn(),
    isAllowedCallback: allowedCallbacksTable.select("*").where("clientId = ? AND url = ?").fn()
};

const Sessions = {
    get: sessionsTable.select("*").where("id = ?").fn(),
    delete: sessionsTable.delete("id = ?").fn(),
    deleteExpired: sessionsTable.delete("expiresTimestamp < ?").fn()
};

const AuthCodes = {
    get: authCodesTable.select("*").where("id = ? AND clientId = ?").fn(),
    delete: authCodesTable.delete("id = ?").fn(),
    deleteExpired: authCodesTable.delete("expiresTimestamp < ?").fn()
};

setInterval(() => {
    console.log("Cleaning up database...");
    Sessions.deleteExpired();
    AuthCodes.deleteExpired();
}, config.dbCleanupInterval * 1000);

module.exports = {Clients, Sessions, Users, AuthCodes};