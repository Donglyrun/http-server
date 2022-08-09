const http = require("http");
const path = require("path");
const fs = require("fs").promises;
const url = require("url");
const os = require("os");
const chalk = require("chalk"); // 第三方 粉笔 展现不同的颜色
const parse = require("url-parse");
const mime = require("mime");
const ejs = require("ejs");

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
        // 根据路径读取对应的目录
        let dirs = await fs.readdir(queryPath);

        let fileStatus = await Promise.all(
          dirs.map(
            async (dir) =>
              await fs.stat(path.join(this.directory, pathname, dir))
          )
        );

        dirs = dirs.map((dir, index) => {
          return {
            url: path.join(pathname, dir),
            dir,
            info: fileStatus[index].isFile() ? "文件" : "文件夹",
            size: fileStatus[index].size || 0,
          };
        });

        let html = await ejs.renderFile(
          path.resolve(__dirname, "./template.html"),
          { dirs }
        );

        res.setHeader(
          "Content-Type",
          mime.getType(queryPath) + ";charset=utf-8"
        );

        res.end(html);
      }
    } catch (err) {
      this.sendError(err, res);
    }
  };
  sendError(err, res) {
    res.end("not found");
  }

  sendFile(queryPath, req, res) {
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
