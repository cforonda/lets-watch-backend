
handleClientUpdate = (socket, io, event = '') => {

    // retrieve a list of all connected clients
    io.clients((error, clients) => {
        if (error) throw error;

        // notify the server if a client has connected/disconnected 
        // and update the terminal
        if(event) {
            console.log(event);
            console.log('Number of Connected Clients: ', clients.length);
        }

        // notify all users of the event
        socket.broadcast.emit('updateClients', { 
            message: event,
            numClients: clients.length
        });
    });
}

const addNewClientConnectListener = (socket, io) => {
    const event = 'New Client Connected!'
    handleClientUpdate(socket, io, event);
}

const handleClientDisconnect = (socket, io) => {
    const event = 'Client Disconnected!'
    handleClientUpdate(socket, io, event);
}

const addNumClientsListener = (socket, io) => {
    socket.on('getNumClients', () => {
        handleClientUpdate(socket, io);
    });
}

const addClientDisconnectListener = (socket, io) => {
    socket.on("disconnect", () => {
        handleClientDisconnect(socket, io);
    });
}

const addClientNicknameListener = (socket) => {
    socket.on('update-nickname', nickname => {
        console.log('retrieved a nickname!: ', nickname)
        socket.nickname = nickname;
    });
}

module.exports = {
    setupClientConnectionListeners: (socket, io) => {
        addNewClientConnectListener(socket, io);
        addClientNicknameListener(socket);
        addNumClientsListener(socket, io);
        addClientDisconnectListener(socket, io);
    }    
}