
const handleLeavingClient = (socketNickname, connectedClients) => {
    const leavingClient = connectedClients.filter(client => client.user === socketNickname);
    connectedClients = connectedClients.filter(client => client.user !== socketNickname && client.room !== leavingClient.room)
    console.log(`user ${userNickname} has left room: ${leavingClient.room}`);
    return leavingClient;
}

const addClientRoomListener = (socket, io, connectedClients) => {
    socket.on('join-room', socketRoom => {
        const userNickname = socket.nickname;
        console.log(`user ${userNickname} would like to join room: ${socketRoom}`);
        try {
            socket.join(socketRoom);
            console.log(`user ${userNickname} has joined room: ${socketRoom}`);
            
            socket.emit('user-joined-room', {
                message: `Welcome to the party ${userNickname}`
            });

            io.to(socketRoom).emit('user-joined-room', {
                message: `Hey everyone! ${userNickname} just joined us in room:${socketRoom}`
            });

            connectedClients.push({
                user: userNickname,
                room: socketRoom
            });
            console.log('CONNECTED CLIENTS: ', connectedClients );


            return new Promise((resolve, reject) => {
                io.of('/').in(socketRoom).clients((error, clients) => {
                    resolve(clients);
                  });
            }).then(clients => {
               console.log(`There are ${clients.length} clients in room: ${socketRoom}`);
            })
        } catch (e) {
            console.log(`user ${userNickname} failed to join ${socketRoom}.`);
            console.log(`Here is why: ${e.message}`);
            socket.emit('user-joined-room-failed', {
                message: `Sorry ${userNickname}, It looks like you can't join ${socketRoom}... :'(`,
                error: e.message
            });
        }
    }); 

    socket.on('leave-room', socketNickname => {
        console.log('inside of the leave room listener');
        console.log('socketNickname of person leaving: ', socketNickname);
       const leavingClient = handleLeavingClient(socketNickname, connectedClients);

        io.to(leavingClient.room).emit('user-left-room', {
            message: `Hey everyone! ${userNickname} just left  ${leavingCLient.room}`
        });
    })
}

module.exports = {
    setupClientRoomListeners: (socket, io, connectedClients) => {
        addClientRoomListener(socket, io, connectedClients);
    }
}