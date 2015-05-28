'use strict';

var crypto = require("crypto");

function decrypt(encBase64, iv, keyBuf) {
  var buffer = new Buffer(encBase64, 'base64');
  // required 256 bits (same as keysize)

  var decipher = crypto.createDecipheriv('aes-256-cbc', keyBuf, iv);
  var message = decipher.update(buffer, null, 'utf8');
  message += decipher.final('utf8');

  // "this is a secret message"
  console.log(message);
}

function deriveKey(saltBuf, passphrase) {
  var iterations = 100;
  var keyLenBits = 256;
  var keyLenBytes = (keyLenBits / 8);
  var digest = 'sha256';

  return new global.Promise(function (resolve, reject) {
    crypto.pbkdf2(passphrase, saltBuf, iterations, keyLenBytes, digest, function (err, key) {
      if (err) {
        reject(err);
        return;
      }

      console.log('');
      console.log('passphrase', passphrase);
      console.log('salt (hex)', saltBuf.toString('hex'));
      console.log('iterations', iterations);
      console.log('keyLen (bytes)', keyLenBytes);
      console.log('digest', digest);

      console.log('');
      console.log('key len', key.length);
      console.log('key hex', key.toString('hex'));
      console.log('key base64', key.toString('base64'));
      resolve(key);
    });
  });
}

function run(keyBuf, data) {
  // TODO derive IV from key buffer
  function createIv() {
    // IV is always (?) 128-bit
    var ivLen = (128 / 8);
    var iv = new Buffer(ivLen);
    var i;
    for (i = 0; i < ivLen; i += 1) {
      iv[i] = 0;
    }

    return iv;
  }

  var encBase64 = data.toString('base64');
  var iv = createIv();

  decrypt(encBase64, iv, keyBuf);
}

deriveKey(
  new Buffer('6FxT5/EZ1B/XiVzcnXu53RneW6vSwf30uNrXyzNE2IY=', 'base64')
, "wicked awesome sauce!"
).then(function (keyBuf) {
  //var encryptedBuf = new Buffer('1e693c98e821caf916ec20bed7b6e1d7c4e741d67211a8568398f35c01de469e2fc9c6cb641e238c779f338601e7f12505e4d3af557f748472a58efbdae805dac72a291d1a4623afe435352c563a24485ba58b8d7267adf814c9ad6bb5f370ed', 'hex');
  var encryptedBuf = new Buffer('Hmk8mOghyvkW7CC+17bh18TnQdZyEahWg5jzXAHeRp4vycbLZB4jjHefM4YB5/ElBeTTr1V/dIRypY772ugF2scqKR0aRiOv5DU1LFY6JEhbpYuNcmet+BTJrWu183Dt', 'base64');
  return run(keyBuf, encryptedBuf);
});
