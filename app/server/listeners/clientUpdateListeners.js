const util = require('../util/util');

const addClientUpdateListener = (socket, io, users) => {
    socket.on('update-user', ({user, room}) => {
        try {
            users[socket.id] = {
                user: user, 
                room: room
            }; 
            socket.join(room);
    
            socket.emit('welcome-new-user-to-room', {
                message: `Welcome to the party ${user}`
            }); 
    
            io.to(room).emit('user-joined-room', {
                message: `Hey everyone! ${user} just joined us in room:${room}`, 
            });

            io.to(room).emit('update-clients', {
                numClients: util.getNumUsersInRoom(users, room)
            }) 

            console.log('CONNECTED CLIENTS: ', users ); 
            console.log(`There are ${util.getNumUsersInRoom(users, room)} clients in room: ${room}`);

        } catch (e) {
            console.log("There is an issue: ", e.message);
            socket.emit('user-joined-room-failed', {
                message: `Sorry ${user}, It looks like you can't join ${room}... :'(`,
                error: e.message
            });
        }
    })
}

module.exports = {
    setupClientUpdateListeners: (socket, io, users) => {
        addClientUpdateListener(socket, io, users);
    }
} 