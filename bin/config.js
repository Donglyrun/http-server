module.exports = {
  port: {
    option: "-p,--port <port>",
    description: "Port to use. if 0, look for open port.",
    defaultVal: 8080,
  },
  directory: {
    option: "-d,--directory <dir>",
    description: "",
    defaultVal: process.cwd(),
  },
};
