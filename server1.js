const net = require("net");
const server = net.createServer(function (soket) {
  soket.on("data", function (data) {
    console.log(data.toString());
  });
  soket.on("end", function () {
    console.log("客户端关闭");
  });
});

server.listen(3000);
