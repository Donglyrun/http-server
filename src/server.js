const http = require("http");
const path = require("path");
const fs = require("fs").promises;
const url = require("url");
const os = require("os");
const chalk = require("chalk"); // 第三方 粉笔 展现不同的颜色
const parse = require("url-parse");
const mime = require("mime");

const { createReadStream } = require("fs");

class Server {
  constructor(options = {}) {
    this.port = options.port;
    this.directory = options.directory;
    this.address = options.address;
    this.start();
  }
  // 处理客户端的请求和响应
  handleRequest = async (req, res) => {
    // 获取用户的路径
    let { pathname, query } = parse(req.url, true);

    let queryPath = path.join(this.directory, pathname);

    try {
      let stateObj = await fs.stat(queryPath);
      if (stateObj.isFile()) {
        this.sendFile(queryPath, req, res);
      } else {
        //1.
        //2.
        //3.
        //4.
      }
    } catch (err) {
      this.sendError(err, res);
    }
  };
  sendError(err, res) {
    res.end("not found");
  }

  sendFile(queryPath, req, res) {
    // hhtp 1.0 用的 expires
    // res.setHeader("Expires", new Date(Date.now() + 10 * 1000).toGMTString());
    // 设置强制缓存 不用每次都请求了 10s 内不要来访问css
    res.setHeader("cache-control", "max-age=86400"); // 10s 内找浏览器的本地缓存

    console.log(req.url);

    res.setHeader("Content-Type", mime.getType(queryPath) + ";charset=utf-8");
    createReadStream(queryPath).pipe(res);
  }

  start() {
    const server = http.createServer(this.handleRequest);
    const port = this.port;

    const address = this.address.map(
      (item) => `http://${item}:${chalk.green(port)}`
    );

    server.listen(port, () => {
      console.log(address.join("\r\n"));
    });
  }
}

module.exports = function createServer(userConfig) {
  const interface = os.networkInterfaces();
  const address = Object.values(interface)
    .flat(1)
    .filter((item) => item.family === "IPv4")
    .map((item) => item.address);
  userConfig["address"] = address;

  return new Server(userConfig);
};
