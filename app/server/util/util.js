module.exports = {
    getUsersInRoom: (users, room) => Object.values(users).filter(user => user.room === room),
    
    getNumUsersInRoom: (users, room) => module.exports.getUsersInRoom(users, room).length,
}  