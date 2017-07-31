
var http = require("http"); 
http.createServer(function(request, response) { 
  response.sendHeader(200, {"Content-Type": "text/html"}); 
  response.write("Hello World!"); 
  response.close();
}).listen(25565);
