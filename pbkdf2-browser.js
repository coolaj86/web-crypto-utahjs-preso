function ab2hex(ab) {
  var dv = new DataView(ab);
  var i;
  var len;
  var hex = '';
  var c;

  for (i = 0, len = dv.byteLength; i < len; i += 1) {
    c = dv.getUint8(i).toString(16);
    if (c.length < 2) {
      c = '0' + c;
    }
    hex += c;
  }

  return hex;
}
function hex2ab(hex) {
  var i;
  var byteLen = hex.length / 2;
  var ab;
  var j = 0;

  if (byteLen !== Math.ceil(byteLen)) {
    console.log('ignoring bad hex length');
    return;
  }

  ab = new Uint8Array(byteLen);

  for (i = 0; i < byteLen; i += 1) {
    ab[i] = parseInt(hex[j] + hex[j + 1], 16);
    j += 2;
  }

  return ab.buffer;
}
(function () {
'use strict';

var Unibabel = window.Unibabel;
var passphrase = 'wicked awesome sauce!';
// var saltBase64 = '6FxT5/EZ1B/XiVzcnXu53RneW6vSwf30uNrXyzNE2IY=';
var saltHex = 'e85c53e7f119d41fd7895cdc9d7bb9dd19de5babd2c1fdf4b8dad7cb3344d886';
var saltArr = window.hex2ab(saltHex);
//var saltBuf = saltArr.buffer;
var keyLenBits = 256;
var iterations = 100;
//var hashname = 'SHA-1';
var hashname = 'SHA-256';

/*
crypto.pbkdf2(
  passphrase, saltBuf, iterations, keyLenBits / 8, hashname
, function (err, keyBuf) {
    var keyHex = keyBuf.toString('hex');
    console.log('Key Buf', keyBuf);
    console.log('Key Hex', keyHex);
  }
);
*/

var webcrypto = window.crypto;
var kdfname = "PBKDF2";
var aesname = "AES-CBC"; // AES-CTR is also popular

function deriveKey(saltArr, passphrase, keyLenBits) {
  // First, create a PBKDF2 "key" containing the password
  return webcrypto.subtle.importKey(
    "raw",
    Unibabel.strToUtf8Arr(passphrase),
    {"name": kdfname},
    false,
    ["deriveKey"]).
  // Derive a key from the password
  then(function(passphraseKey){
    console.log('passphraseKey');
    console.log(passphraseKey);

    return webcrypto.subtle.deriveKey(
      {
        "name": kdfname,
        "salt": saltArr,
        "iterations": iterations,
        "hash": hashname
      },
      passphraseKey,
      // required to be 128 or 256 bits
      { "name": aesname, "length": keyLenBits }, // Key we want
      true,                                    // Extrable
      [ "encrypt", "decrypt" ]                 // For new key
    );
  }).
  // Export it so we can display it
  then(function(aesKey) {
    return webcrypto.subtle.exportKey("raw", aesKey);
  }).
  catch(function(err) {
    window.alert("Key derivation failed: " + err.message);
  });
}

deriveKey(saltArr, passphrase, keyLenBits).then(function (keyBuf) {
  var keyArr = new Uint8Array(keyBuf);
  var keyHex = ab2hex(keyArr.buffer);

  console.log('');
  console.log('passphrase', passphrase);
  console.log('salt (hex)', saltHex);
  console.log('iterations', iterations);
  console.log('keyLen (bytes)', keyLenBits / 8);
  console.log('digest', hashname);


  console.log('');
  console.log('key len', keyArr.length);
  console.log('key arr', keyArr);
  console.log('key hex', keyHex);
});

}());
