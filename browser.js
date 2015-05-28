(function () {
'use strict';

var webcrypto = window.crypto || window.msCrypto || window.webkitCrypto || window.mozCrypto;
if (webcrypto.webkitSubtle) {
  webcrypto.subtle = webcrypto.webkitSubtle;
}
var Unibabel = window.Unibabel;
var ab2hex = window.ab2hex;
var hex2ab = window.hex2ab;

var arrayBufferToHexString = ab2hex;
//var hexStringToArrayBuffer = hex2ab;
var stringToArrayBuffer = Unibabel.strToUtf8Arr;

function encrypt(keyBuf, data) {
  //var keyStr = 'VzC2coGPrvecrigzB38DRLGiwVrgiwnQznyrD9BYxAk=';
  //var keyBuf = window.Unibabel.base64ToArr(keyStr);
  //var message = "this is a secret message !¶☢☃𩶘𝄢";
  var ivLen = (128 / 8);
  var iv = new Uint8Array(ivLen); // defaults to all 0s, which is fine for this demo
  // TODO derive iv from key?
  //var iv = new Uint8Array(keyBuf.slice(0, ivLen));
  //var arrb = window.Unibabel.strToUtf8Arr(message);
  //var data = arrb.buffer;
  //console.log('message as buffer', arrb.length);
  //console.log(arrb);

  console.log('iv', iv);
  console.log('keyBuf', keyBuf.length);
  console.log(keyBuf);

  return webcrypto.subtle.importKey(
      "raw",
      keyBuf,
      { name: "AES-CBC" },
      true,
      ["encrypt", "decrypt"]
  )
  .then(function(key){
      //returns the symmetric key
      console.log('key', key);
      var algo = key.algorithm;
      algo.iv = iv;

      return webcrypto.subtle.encrypt(
          algo,
          key, //from generateKey or importKey above
          data //ArrayBuffer of data you want to encrypt
      ).then(function(encrypted){
        //returns an ArrayBuffer containing the encrypted data
        // TODO base64
        //console.log(new Uint8Array(encrypted));
        console.log('encrypted');
        console.log(new Uint8Array(encrypted));
        console.log(new Uint8Array(encrypted).length);

        console.log('encrypted', window.Unibabel.arrToBase64(new Uint8Array(encrypted)));

        return webcrypto.subtle.decrypt(
            algo,
            key, //from generateKey or importKey above
            encrypted //ArrayBuffer of data you want to encrypt
        )
        .then(function(decrypted){
            //returns an ArrayBuffer containing the encrypted data
            console.log(new Uint8Array(encrypted));
            console.log('decrypted', window.Unibabel.utf8ArrToStr(new Uint8Array(decrypted)));

            return encrypted;
        })






         // error handling

        .catch(function(err){
            console.error(err);
        });
      })
      .catch(function(err){
          console.error(err);
      });
  })
  .catch(function(err){
      console.error(err);
  });
}

function deriveKey(saltBuf, passphrase) {
  var keyLenBits = 256;
  // 100 - probably safe even on a browser running from a raspberry pi using pure js ployfill
  // 10000 - no noticeable speed decrease on my MBP
  // 100000 - you can notice
  // 1000000 - annoyingly long
  var kdfname = "PBKDF2";
  var aesname = "AES-CBC"; // AES-CTR is also popular
  var iterations = 100; // something a browser on a raspberry pi or old phone could do
  var hashname = "SHA-256";

  console.log('');
  console.log('passphrase', passphrase);
  console.log('salt (hex)', ab2hex(saltBuf));
  console.log('iterations', iterations);
  console.log('keyLen (bytes)', keyLenBits / 8);
  console.log('digest', hashname);

  // First, create a PBKDF2 "key" containing the password
  return webcrypto.subtle.importKey(
    "raw",
    stringToArrayBuffer(passphrase),
    {"name": kdfname},
    false,
    ["deriveKey"]).
  // Derive a key from the password
  then(function(passphraseKey){
    return webcrypto.subtle.deriveKey(
      {
        "name": kdfname,
        "salt": saltBuf,
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

$(function () {
  // generated with Unibabel.arrToBase64(webcrypto.getRandomValues(new Uint8Array(32)));

  function docDeriveKey() {
    var passphrase = $('.js-crypto-passphrase').val();
    var saltHex = $('.js-crypto-salt').val();
    var saltBuf = hex2ab(saltHex);
    var msg = Unibabel.strToUtf8Arr($('.js-crypto-msg').val()).buffer;
    console.log('passphrase');
    console.log(passphrase);
    console.log('salt hex');
    console.log(saltHex);

    console.log(msg);
    webcrypto.subtle.digest("SHA-1", msg).then(function (sha1buf) {
      $('.js-crypto-sha1').val(ab2hex(sha1buf));
    });

    return deriveKey(saltBuf, passphrase).then(function (keyBuf) {
      var keyArr = new Uint8Array(keyBuf);
      var keyHex = arrayBufferToHexString(keyArr.buffer);

      console.log('');
      console.log('key len', keyArr.length);
      console.log('key arr', keyArr);
      console.log('key hex', keyHex);

      $('.js-crypto-key').val(keyHex);
      return encrypt(keyBuf, msg).then(function (buf) {
        console.log('ciphered buf', buf);
        $('.js-crypto-ciphered').val(ab2hex(buf));
        //$('.js-crypto-ciphered').val(Unibabel.arrToBase64(new Uint8Array(buf)));
      });
    });
  }

  var saltArr = Unibabel.base64ToArr("6FxT5/EZ1B/XiVzcnXu53RneW6vSwf30uNrXyzNE2IY=");
  $('.js-crypto-salt').val(ab2hex(saltArr.buffer));

  $('body').on('change', '.js-crypto-msg', docDeriveKey);
  $('body').on('keyup', '.js-crypto-msg', docDeriveKey);
  $('body').on('change', '.js-crypto-passphrase', docDeriveKey);
  $('body').on('keyup', '.js-crypto-passphrase', docDeriveKey);
  docDeriveKey();
});

}());
