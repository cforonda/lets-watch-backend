
const express = require("express");
const index = require("../routes/index.js");
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

const addNewClientConnectListener = socket => {
    clients++;
    console.log("New client connected");
    console.log('Number of connected clients: ' + clients);
    socket.broadcast.emit('newclientconnect',
        { numClients: clients }
    );
}

const handleClientDisconnect = socket => {
    console.log("Client disconnected");
    clients--;
    console.log('Number of connected clients: ' + clients);
    socket.broadcast.emit('clientDisconnect', { numClients: clients});
}

const addStreamListener = socket => {
    socket.on('stream', data => {
        socket.broadcast.emit('stream',data);
    });

    io.of('/stream').clients((error, clients) => {
        if (error) {
            throw error;
        }
          console.log(clients);
      });
}

const addNumClientsListener = socket => {
    socket.on('getNumClients', () => {
        socket.broadcast.emit('newclientconnect', { numClients: clients });
    });
}

const addClientDisconnectListener = socket => {
    socket.on("disconnect", () => {
        handleClientDisconnect(socket);
    });
}

const addSocketListeners = socket => {

    addNewClientConnectListener(socket);

    addStreamListener(socket);

    addNumClientsListener(socket);
    
    addClientDisconnectListener(socket);
    
}

io.on('connection', socket => {
    addSocketListeners(socket);
});



server.listen(port, () => console.log(`\x1b[40m`,`\x1b[32m`,
`
    [+] Server         : http://localhost:${port}
    [+] Socket         : ws://localhost:${config.Server.settings.port}
    [~] Running Server...
`,`\x1b[0m`));
