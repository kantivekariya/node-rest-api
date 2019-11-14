// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes256';
const key = crypto.randomBytes(32);

exports.encrypt = (text) => {
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
}