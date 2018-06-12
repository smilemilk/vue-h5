import md5 from "md5";

//app端接口请求封装
export function h5Request(dataParams,url) {

  //把所传的参数进行拼接处理
  let data = '{';
  for (const key in dataParams) {
    data += '"'+ key +'":' + '"'+ dataParams[key] +'",';
  }
  data = data.substr(0,data.length-1) + '}';

  let queryParams = {
    name: url, //接口地址
    version: "",
    app_key: "test",
    data: encodeURIComponent(data), // 把字符串作为 URI 组件进行编码
    timestamp: "",
    format: "json",
    access_token: ""
  }

  // 时间
  queryParams.timestamp = formatDate(new Date());
  
  // 所有的参数(sign除外)进行-无缝拼接和md5加密-然后作为参数sign的值
  queryParams.sign = buildSign(queryParams, "123456");
  return queryParams;
}

// 获取uuid
export function getUuid(len, radix) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  var uuid = [],i;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    var r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    uuid[14] = "4";
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join("");
}

// 无缝拼接和md5加密
function buildSign(postData, secret) {
  var paramNames = [];
  for (var key in postData) {
    paramNames.push(key);
  }
  paramNames.sort();
  var paramNameValue = [];
  for (var i = 0, len = paramNames.length; i < len; i++) {
    var paramName = paramNames[i];
    paramNameValue.push(paramName);
    paramNameValue.push(postData[paramName]);
  }
  var source = secret + paramNameValue.join("") + secret;
  return md5(source).toUpperCase();
}
function add0(m) {
  return m < 10 ? "0" + m : m;
}
// 时间格式化
function formatDate(time) {
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return (
    y +
    "-" +
    add0(m) +
    "-" +
    add0(d) +
    " " +
    add0(h) +
    ":" +
    add0(mm) +
    ":" +
    add0(s)
  );
}

// base64 加密、解密
const Base64 = {  

    // private property  
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding  加密
    encode : (input) => {  
        var output = "";  
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = Base64._utf8_encode(input);  
        while (i < input.length) {  
            chr1 = input.charCodeAt(i++);  
            chr2 = input.charCodeAt(i++);  
            chr3 = input.charCodeAt(i++);  
            enc1 = chr1 >> 2;  
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);  
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  
            enc4 = chr3 & 63;  
            if (isNaN(chr2)) {  
                enc3 = enc4 = 64;  
            } else if (isNaN(chr3)) {  
                enc4 = 64;  
            }  
            output = output +  
            Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +  
            Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);  
        }  
        return output;  
    },

    // public method for decoding  解密
    decode : (input) => {  
        var output = "";  
        var chr1, chr2, chr3;  
        var enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");  
        while (i < input.length) {  
            enc1 = Base64._keyStr.indexOf(input.charAt(i++));  
            enc2 = Base64._keyStr.indexOf(input.charAt(i++));  
            enc3 = Base64._keyStr.indexOf(input.charAt(i++));  
            enc4 = Base64._keyStr.indexOf(input.charAt(i++));  
            chr1 = (enc1 << 2) | (enc2 >> 4);  
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);  
            chr3 = ((enc3 & 3) << 6) | enc4;  
            output = output + String.fromCharCode(chr1);  
            if (enc3 != 64) {  
                output = output + String.fromCharCode(chr2);  
            }  
            if (enc4 != 64) {  
                output = output + String.fromCharCode(chr3);  
            }  
        }  
        output = Base64._utf8_decode(output);  
        return output;  
    },  

    // private method for UTF-8 encoding  
    _utf8_encode : (string) => {  
        string = string.replace(/\r\n/g,"\n");  
        var utftext = "";  
        for (var n = 0; n < string.length; n++) {  
            var c = string.charCodeAt(n);  
            if (c < 128) {  
                utftext += String.fromCharCode(c);  
            } else if((c > 127) && (c < 2048)) {  
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

    // private method for UTF-8 decoding  
    _utf8_decode : (utftext) => {  
        var string = "";  
        var i = 0;  
        var c = 0,c1 = 0,c2 = 0;  
        while ( i < utftext.length ) {  
            c = utftext.charCodeAt(i);  
            if (c < 128) {  
                string += String.fromCharCode(c);  
                i++;  
            } else if((c > 191) && (c < 224)) {  
                c2 = utftext.charCodeAt(i+1);  
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));  
                i += 2;  
            } else {  
                c2 = utftext.charCodeAt(i+1);  
                c3 = utftext.charCodeAt(i+2);  
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));  
                i += 3;  
            }  
        }  
        return string;  
    }  
}

export {Base64};