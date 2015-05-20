'use strict';
console.log("WORK IN PROGRESS");
console.log("");
console.log("");

var webcrypto = window.crypto || window.msCrypto || window.webkitCrypto || window.mozCrypto;
var keyStr = 'VzC2coGPrvecrigzB38DRLGiwVrgiwnQznyrD9BYxAk=';
var keyBuf = window.Unibabel.base64ToArr(keyStr); //.buffer;
var message = "this is a secret message";
// var iv = window.crypto.getRandomValues(new Uint8Array(16))
var ivLen = (128 / 8);
var iv = new Uint8Array(ivLen);
var arrb = window.Unibabel.strToUtf8Arr(message);
var data = arrb.buffer;
console.log('message as buffer');
console.log(arrb);
console.log(arrb.length);
console.log('');
/*
var i;
for (i = 0; i < ivLen; i += 1) {
  iv[i] = 0;
}
*/

console.log('keyBuf');
console.log(keyBuf);
console.log(keyBuf.length);
console.log('');

webcrypto.subtle.importKey(
    "raw", //can be "jwk" or "raw"
    keyBuf, // ArrayBuffer
    {   //this is the algorithm options
        name: "AES-CBC",
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    ["encrypt", "decrypt"] //can be any combination of "encrypt" and "decrypt"
)
.then(function(key){
    //returns the symmetric key
    console.log('key', key);
    console.log('');

    return window.crypto.subtle.encrypt(
        {
            name: "AES-CBC",
            //Don't re-use initialization vectors!
            //Always generate a new iv every time your encrypt!
            iv: iv,
        },
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
          {
              name: "AES-CBC",
              //Don't re-use initialization vectors!
              //Always generate a new iv every time your encrypt!
              iv: iv,
          },
          key, //from generateKey or importKey above
          data //ArrayBuffer of data you want to encrypt
      )
      .then(function(decrypted){
          //returns an ArrayBuffer containing the encrypted data
          // TODO base64
          //console.log(new Uint8Array(encrypted));
          console.log('decrypted', window.Unibabel.arrToBase64(new Uint8Array(decrypted)));
      })
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
