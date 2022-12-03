const Database = require("better-sqlite3");
const config = require("../config.json");
const Table = require("./crud");

const db = new Database("data/microauth.db");
db.pragma("foreign_keys = ON");

const usersTable = new Table(db, "users", [
    "id STRING PRIMARY KEY",
    "email STRING NOT NULL UNIQUE",
    "passwordHash STRING NOT NULL",
    "salt STRING NOT NULL",
    "isAdmin INTEGER NOT NULL"
]);

const clientsTable = new Table(db, "clients", [
    "id STRING PRIMARY KEY",
    "secret STRING NOT NULL",
    "friendlyName STRING NOT NULL",
]);

const allowedCallbacksTable = new Table(db, "allowedCallbacks", [
    "clientId STRING NOT NULL",
    "url STRING NOT NULL",
    "PRIMARY KEY (clientId, url)",
    "FOREIGN KEY (clientId) REFERENCES clients(id)"
]);

db.exec("INSERT OR IGNORE INTO clients VALUES ('testclientid', 'testclientsecret', 'Test Client')");
db.exec("INSERT OR IGNORE INTO allowedCallbacks VALUES ('testclientid', 'https://openidconnect.net/callback')")
db.exec("INSERT OR IGNORE INTO users VALUES ('testuserid', 'user@mail.com', 'qiug9zTaU9hBBKBcOAxwgAbCdhj7gHXSGRhDA6hll58BWMnXEaxxPAc/uk+Hw45VdODzT7j5mFhGDJE9cjXO8A==', 'Fm3zil5BNjpmgJK/zqUhkg==', 1)")

const sessionsTable = new Table(db, "sessions", [
    "id STRING PRIMARY KEY",
    "userId STRING NOT NULL",
    "initiatorAddr STRING NOT NULL",
    "createdTimestamp INTEGER NOT NULL",
    "expiresTimestamp INTEGER NOT NULL",
    "lastAuthTimestamp INTEGER NOT NULL",
    "FOREIGN KEY (userId) REFERENCES users(id)"
]);

// authorization codes
const authCodesTable = new Table(db, "authCodes", [
    "id STRING PRIMARY KEY",
    "clientId STRING NOT NULL",
    "expiresTimestamp INTEGER NOT NULL",
    "accessToken STRING NOT NULL",
    "idToken STRING NOT NULL",
    "FOREIGN KEY (clientId) REFERENCES clients(id)",
    "FOREIGN KEY (accessToken) REFERENCES accessTokens(id)"
]);

const accessTokensTable = new Table(db, "accessTokens", [
    "id STRING PRIMARY KEY",
    "expiresTimestamp INTEGER NOT NULL",
    "grantedScopes STRING NOT NULL",
    "userId STRING NOT NULL",
    "FOREIGN KEY (userId) REFERENCES users(id)"
]);

const Users = {
    getById: usersTable.select("*").where("id = ?").fn(),
    getByEmail: usersTable.select("*").where("email = ?").fn()
};

const Clients = {
    get: clientsTable.select("*").where("id = ?").fn(),
    getAll: clientsTable.select("*").fn({all: true}),
    getCallbacks: allowedCallbacksTable.select("url").where("clientId = ?").fn({all: true, pluck: true}),
    isAllowedCallback: allowedCallbacksTable.select("*").where("clientId = ? AND url = ?").fn()
};

const Sessions = {
    add: sessionsTable.insert(["id", "userId", "initiatorAddr", "createdTimestamp", "expiresTimestamp", "lastAuthTimestamp"]).fn(),
    _updateAuthTimestamp: sessionsTable.update({lastAuthTimestamp: ":timestamp"}).where("id = :id").fn(),
    renewAuthTimestamp: id => Sessions._updateAuthTimestamp({timestamp: Date.now(), id}),  
    get: sessionsTable.select("*").where("id = ?").fn(),
    delete: sessionsTable.delete("id = ?").fn(),
    deleteExpired: sessionsTable.delete("expiresTimestamp < ?").fn()
};

const AuthCodes = {
    add: authCodesTable.insert(["id", "clientId", "expiresTimestamp", "accessToken", "idToken"]).fn(),
    get: authCodesTable.select("*").where("id = ? AND clientId = ?").fn(),
    delete: authCodesTable.delete("id = ?").fn(),
    deleteExpired: authCodesTable.delete("expiresTimestamp < ?").fn()
};

const AccessTokens = {
    add: accessTokensTable.insert(["id", "expiresTimestamp", "grantedScopes", "userId"]).fn(),
    get: accessTokensTable.select("*").where("id = ?").fn(),
    deleteExpired: accessTokensTable.delete("expiresTimestamp < ?").fn()
};

setInterval(() => {
    console.log("Cleaning up database...");
    Sessions.deleteExpired(Date.now());
    AuthCodes.deleteExpired(Date.now());
    AccessTokens.deleteExpired(Date.now());
}, config.dbCleanupInterval * 1000);

module.exports = {Clients, Sessions, Users, AuthCodes, AccessTokens};