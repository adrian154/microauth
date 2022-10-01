const crypto = require("crypto");

module.exports = {
    generateId: () => crypto.randomFillSync(Buffer.alloc(36)).toString("base64url"),
    hashPassword: password => new Promise((resolve, reject) => {
        const salt = crypto.randomFillSync(Buffer.alloc(16));
        crypto.scrypt(password, salt, 64, (err, hash) => {
            if(err) {
                reject(err);
            }
            resolve({hash, salt});
        });
    }),
    comparePassword: (password, storedHash, salt) => new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, 64, (err, hash) => {
            if(err) {
                reject(err);
            }
            resolve(crypto.timingSafeEqual(hash, storedHash));
        })
    })
};