const streamListener  = require('./streamListener');
const clientListeners = require('./clientConnectionListeners');
const roomListeners = require('./clientRoomListeners');

module.exports = { 
    addSocketListeners: (socket, io) => {
        clientListeners.setupClientConnectionListeners(socket, io);
        roomListeners.setupClientRoomListeners(socket, io);
        streamListener.addStreamListener(socket);
    }
}