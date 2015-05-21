'use strict';

var crypto = require("crypto");
//var encrypted = "dPluq7hwg9nML6DAlAoANOHy15fQCoxCOjr3Aah6bnygTNtLJ8MhFKYjlTXtIK0SulCQqI4x7tQEedo3tFmeB5ugoESAm8Fd7aqxrNk9JoHqJbwyTIKriSAvyKdfqUKWelDYvr35xEKrdF1wvoj5m2sDS4ppGgtRfXtzz2ZjTZHzja/jzicharb8gVOrIgqr";
var encrypted = "dPluq7hwg9nML6DAlAoANB4niyGBB8EOWqwG9Nsc+if3n2RuRhmOmupvAZN9wk8o";
var buffer = new Buffer(encrypted, 'base64');
var keyBuf = new Buffer('VzC2coGPrvecrigzB38DRLGiwVrgiwnQznyrD9BYxAk=', 'base64');
// key = crypto.randomBytes((256 / 8)).toString('base64')
// required 256 bits (same as keysize)

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
var decipher = crypto.createDecipheriv('aes-256-cbc', keyBuf, iv);
var message = decipher.update(buffer, null, 'utf8');
message += decipher.final('utf8');

console.log(message); // "this is a secret message"
