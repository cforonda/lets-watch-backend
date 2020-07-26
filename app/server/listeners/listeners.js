const streamListener  = require('./streamListener');
const clientListeners = require('./clientConnectionListeners');

module.exports = { 
    addSocketListeners: (socket, io) => {
        clientListeners.setupClientConnectionListeners(socket, io);
        streamListener.addStreamListener(socket);
    }
}