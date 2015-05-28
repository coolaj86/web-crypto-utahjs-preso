'use strict';

var crypto = require('crypto');

var passphrase = 'wicked awesome sauce!';
var saltHex = 'e85c53e7f119d41fd7895cdc9d7bb9dd19de5babd2c1fdf4b8dad7cb3344d886';
var saltBuf = new Buffer(saltHex, 'hex');
var keyLenBits = 256;
var iterations = 100;
//var hashname = 'sha1';
var hashname = 'sha256';

crypto.pbkdf2(
  passphrase, saltBuf, iterations, keyLenBits / 8, hashname
, function (err, keyBuf) {
    var keyHex = keyBuf.toString('hex');
    console.log('Key Buf', keyBuf);
    console.log('Key Hex', keyHex);
  }
);
