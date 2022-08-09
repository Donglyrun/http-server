const http = require("http");
// http 模块是基于 net 模块进行的封装
// req 客户端数据 ； req 是一个可读
// res 要给响应写数据；res 是一个可写
let server = http.createServer((req, res) => {
  console.log(req.method); // 获取请求方法，请求方法是大写的
  console.log(req.url); // 路径是包含查询参数的，不会获取到 hash 值，hash路由是不能做seo的。
  console.log(req.httpVersion);

  res.statusCode = 200;
  res.statusMessage = "fuck";
  res.setHeader("Content-Type", "text/plain;charset=utf-8");
  res.write("hellow");
  res.end();
});

let port = 3000;
server.on("request", function () {
  console.log("request2");
});

server.on("error", function (err) {
  if (err && err.code === "EADDRINUS") {
    server.listen(++port);
  }
});

server.listen(port, function () {
  console.log("server start 3000");
});

// 下一步 实现一个 http server 可以在本地启动一个静态服务
//
