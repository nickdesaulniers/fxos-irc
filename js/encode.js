// http://www.webtoolkit.info/javascript-utf8.html
var Utf8 = {
  encode: function (string) {
    var utftext, n, c, len;
    string = string.replace(/\r\n/g,"\n");
    utftext = "";
    for (n = 0, len = string.length; n < len; ++n) {
      c = string.charCodeAt(n);
      if (c < 128) {
        utftext += string[n];
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  },
  decode: function (utftext) {
    var string = "";
    var i = c = c1 = c2 = 0;
    var len = utftext.length;
    while (i < len) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += utftext[i++];
      } else if (c > 191 && c < 224) {
        c1 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
        i += 2;
      } else {
        c1 = utftext.charCodeAt(i + 1);
        c2 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
        i += 3;
      }
    }
    return string;
  }
}

