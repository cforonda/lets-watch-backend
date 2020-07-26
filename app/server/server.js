
const express = require("express");
const index = require("../routes/index");
const http = require("http");
const socketIo = require("socket.io");
const path       = require('path');
const config     = require(path.join(__dirname,"../config/global.json"));
const port       = config.Server.settings.port;
const app        = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', socket => {
    console.log("New client connected");

    socket.on('stream',function(data){
        socket.broadcast.emit('stream',data);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
});

io.of('/stream').clients((error, clients) => {
  if (error) {
      throw error;
  }
    console.log(clients);
});

server.listen(port, () => console.log(`\x1b[40m`,`\x1b[32m`,
`
    [+] Server         : http://localhost:${port}
    [+] Socket         : ws://localhost:${config.Server.settings.port}
    [~] Running Server...
`,`\x1b[0m`));
