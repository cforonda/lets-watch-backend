module.exports = {
    getUsersInRoom: (users, room) => Object.values(users).filter(user => user.room === room),
    
    getNumUsersInRoom: (users, room) => module.exports.getUsersInRoom(users, room).length,

    isRoomEmpty: (users, room) => module.exports.getNumUsersInRoom(users, room) === 0
}  