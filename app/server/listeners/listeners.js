const streamListener  = require('./streamListener');
const clientListeners = require('./clientConnectionListeners');
const clientUpdateListeners = require('./clientUpdateListeners');
const users = {};


module.exports = { 
    addSocketListeners: (socket, io) => {
        clientListeners.setupClientConnectionListeners(socket, io, users);
        clientUpdateListeners.setupClientUpdateListeners(socket, io, users);
        streamListener.setupStreamListener(socket, users);
    }
}