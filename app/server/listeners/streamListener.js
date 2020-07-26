
const express         = require("express");
const http            = require("http");
const socketIo        = require("socket.io");
const app             = express();
const server          = http.createServer(app);
const io              = socketIo(server);

module.exports = {
    addStreamListener: socket => {
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
}