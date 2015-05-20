'use strict';

var crypto = require("crypto");
// key = crypto.randomBytes((256 / 8)).toString('base64')
// required 256 bits (same as keysize)
var keyBuf = new Buffer('VzC2coGPrvecrigzB38DRLGiwVrgiwnQznyrD9BYxAk=', 'base64');

var message = "this is a secret message";
var buffer2 = new Buffer(message, 'utf8');
var messageLen = buffer2.length; //Buffer.byteLength(message);
var buffer = new Buffer(128 * Math.ceil(messageLen / 128));
var i;

for (i = 0; i < messageLen; i += 1) {
  buffer[i] = buffer2[i];
}
for (i = messageLen; i < buffer.length; i += 1) {
  buffer[i] = 0;
}
console.log(buffer.toString('utf8'));
console.log(buffer.length);

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

var iv = createIv();
var cipher = crypto.createCipheriv('aes-256-cbc', keyBuf, iv);
var encrypted = cipher.update(buffer, null, 'base64');
encrypted += cipher.final('base64');

console.log(encrypted);
