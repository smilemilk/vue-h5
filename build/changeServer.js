var fs = require('fs');
var path = require('path');
var argument = process.argv.splice(2);
// 默认server
var server = 'http://appnew.91iji.com/api';

// 后台的接口 用于商品详情 规格 售后等
if (argument[0] === 'testServer') { //测试
    server = 'http://10.1.11.47:8090/api';
} else if (argument[0] === 'yfb') {
    server = 'http://appyfb.91iji.com/api'//预发布
} else if (argument[0] === 'production') {//线上
    server = 'http://appnew.91iji.com/api'
}

// api接口  用于注册页
// if (argument[0] === 'testServer') { //测试/预发布
//     server = 'http://10.1.11.47/api';
// } else if (argument[0] === 'production') {//线上
//     server = 'http://10.1.11.47/api';
// }

var data = 'module.exports = ' + JSON.stringify(server);
fs.writeFile(path.join(__dirname, 'server.js'), data, function (err) {
    if (err) {
        throw err;
    }
    console.log('change server is successful: ' + server);
})
