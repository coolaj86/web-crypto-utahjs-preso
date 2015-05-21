'use strict';

var webcrypto = window.crypto || window.msCrypto || window.webkitCrypto || window.mozCrypto;

var keyStr = 'VzC2coGPrvecrigzB38DRLGiwVrgiwnQznyrD9BYxAk=';
var keyBuf = window.Unibabel.base64ToArr(keyStr);
var message = "this is a secret message !¶☢☃𩶘𝄢";
var ivLen = (128 / 8);
var iv = new Uint8Array(ivLen); // defaults to zero
var arrb = window.Unibabel.strToUtf8Arr(message);
var data = arrb.buffer;
console.log('message as buffer', arrb.length);
console.log(arrb);

console.log('keyBuf', keyBuf.length);
console.log(keyBuf);

webcrypto.subtle.importKey(
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

    return window.crypto.subtle.encrypt(
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

      window.crypto.subtle.decrypt(
          algo,
          key, //from generateKey or importKey above
          encrypted //ArrayBuffer of data you want to encrypt
      )
      .then(function(decrypted){
          //returns an ArrayBuffer containing the encrypted data
          console.log(new Uint8Array(encrypted));
          console.log('decrypted', window.Unibabel.utf8ArrToStr(new Uint8Array(decrypted)));
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
