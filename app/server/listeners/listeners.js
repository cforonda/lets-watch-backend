const streamListener  = require('./streamListener');
const clientListeners = require('./clientConnectionListeners');
const roomListeners = require('./clientRoomListeners');
let connectedClients = [];


module.exports = { 
    addSocketListeners: (socket, io) => {
        clientListeners.setupClientConnectionListeners(socket, io, connectedClients);
        roomListeners.setupClientRoomListeners(socket, io, connectedClients);
        streamListener.addStreamListener(socket, connectedClients);
    }
}