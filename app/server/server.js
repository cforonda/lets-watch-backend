
const express = require("express");
const index = require("../routes/index");
const http = require("http");
const socketIo = require("socket.io");
const path       = require('path');
const config     = require(path.join(__dirname,"../config/global.json"));
const port       = process.env.PORT || config.Server.settings.port;
const app        = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);
let clients = 0;


io.on('connection', socket => {
    console.log("New client connected");
    clients++;
    console.log('Number of connected clients: ' + clients);

    socket.broadcast.emit('newclientconnect',
        { numClients: clients }
    );

    socket.on('stream', data => {
        socket.broadcast.emit('stream',data);
    });

    socket.on('getNumClients', () => {
        socket.broadcast.emit('newclientconnect', { numClients: clients });
    })
   

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      clients--;
      console.log('Number of connected clients: ' + clients);
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
