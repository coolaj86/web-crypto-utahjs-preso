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
