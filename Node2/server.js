/*server.js*/

var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var hostname = '127.0.0.1'; /*= loop around to local host*/

var port = 3000;

var server = http.createServer(function(req, res) {
    fs.readFile('C:/Users/tsmar/tshirtfront.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
     });
     var u = url.parse(String(req.url), true);
     var tf = false;
     console.log(u.pathname);
     if(u.pathname == '/image1.jpg'){
        fs.readFile('C:/Users/tsmar/Desktop/qsTee.jpg', function(err, content){
            if(err){
                res.writeHead(400, {'Content-type': 'text/html'});
                console.log(err);
                res.end("404- no image exists");
                throw err;
            }else{
                console.log("writing image");
                res.writeHead(200, {'Content-type': 'img/jpg'});
                res.end(content);
            }
        });
     }
});

server.listen(port, hostname, function(){
    console.log('Server runing at http://' + hostname + ':' + port + '/');
});
