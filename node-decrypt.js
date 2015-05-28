'use strict';

var crypto = require("crypto");
//var encrypted = "dPluq7hwg9nML6DAlAoANOHy15fQCoxCOjr3Aah6bnygTNtLJ8MhFKYjlTXtIK0SulCQqI4x7tQEedo3tFmeB5ugoESAm8Fd7aqxrNk9JoHqJbwyTIKriSAvyKdfqUKWelDYvr35xEKrdF1wvoj5m2sDS4ppGgtRfXtzz2ZjTZHzja/jzicharb8gVOrIgqr";
//var encrypted = "dPluq7hwg9nML6DAlAoANB4niyGBB8EOWqwG9Nsc+if3n2RuRhmOmupvAZN9wk8o";
//var encrypted = "WZZZ2zQiDBapiAkmA+CCMJM6x8K66bToJ9PsBW/hxBoy9OnTZ3Q78O15NK0vbgkOHoM4Mo63I8CbGHtHzaDG4+bnOS9KyFjt2K3VcVRqLlNCr6Nba24snDLZHvWTeRQu";
//var buffer = new Buffer(encrypted, 'base64');
var encrypted = "599659db34220c16a988092603e08230933ac7c2bae9b4e827d3ec056fe1c41a32f4e9d367743bf0ed7934ad2f6e090e1e8338328eb723c09b187b47cda0c6e3e6e7392f4ac858edd8add571546a2e5342afa35b6b6e2c9c32d91ef59379142e";
var buffer = new Buffer(encrypted, 'hex');
//var keyBuf = new Buffer('VzC2coGPrvecrigzB38DRLGiwVrgiwnQznyrD9BYxAk=', 'base64');
var keyBuf = new Buffer('a29944a586a03d56ea963bdfca3879aac4a5a44da935fe883ec7909aeca9b040', 'hex');
// key = crypto.randomBytes((256 / 8)).toString('base64')
// required 256 bits (same as keysize)
console.log(keyBuf);

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

/*
function createIv(buf) {
  // IV is always (?) 128-bit
  var ivLen = (128 / 8);
  var iv = buf.slice(0, ivLen);
  return iv;
}
*/

var iv = createIv(keyBuf);
var decipher = crypto.createDecipheriv('aes-256-cbc', keyBuf, iv);
var message = decipher.update(buffer, null, 'utf8');
console.log(message);
message += decipher.final('utf8');

console.log(message); // "this is a secret message"
