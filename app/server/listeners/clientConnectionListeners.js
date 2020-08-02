const util = require('../util/util');

handleClientUpdate = (io, socketRoom='community', event = '', users) => {
    if(event) {
        console.log(event);
    }
    // notify all users of the event
    io.to(socketRoom).emit('update-clients', { 
        message: event,
        numClients: util.getNumUsersInRoom(users, socketRoom)
    });
} 

const addNewClientConnectListener = (socket, io, users) => {
    const event = 'New Client Connected!'
    handleClientUpdate(io, null, event, users);
}  


const handleClientDisconnect = (socket, io, users) => { 
    const event = 'Client Disconnected!'
    console.log(`user ${users[socket.id].user} has left room: ${users[socket.id].room}`);
    io.to(users[socket.id].room).emit('user-left-room', {
        message: `Hey everyone! ${users[socket.id].user} just left  ${users[socket.id].room}`
    });
    const room = users[socket.id].room;
    delete users[socket.id];
    console.log('room:', room);
    handleClientUpdate(io, room, event, users);
}

const addClientDisconnectListener = (socket, io, users) => {
    socket.on("disconnect", () => {
        handleClientDisconnect(socket, io, users);
        console.log('CONNECTED CLIENTS: ', users ); 
    });
}  

module.exports = {
    setupClientConnectionListeners: (socket, io, users) => {
        addNewClientConnectListener(socket, io, users);
        addClientDisconnectListener(socket, io, users);
    }    
}