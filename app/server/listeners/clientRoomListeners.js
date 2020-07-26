
const addClientRoomListener = (socket, io) => {
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
        } catch (e) {
            console.log(`user ${userNickname} failed to join ${socketRoom}.`);
            console.log(`Here is why: ${e.message}`);
            socket.emit('user-joined-room-failed', {
                message: `Sorry ${userNickname}, It looks like you can't join ${socketRoom}... :'(`,
                error: e.message
            });
        }
    }); 
}

module.exports = {
    setupClientRoomListeners: (socket, io) => {
        addClientRoomListener(socket, io);
    }
}