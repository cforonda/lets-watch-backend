
const videos = {};

const addStreamListener = (socket, io, users) => {

    const updateClientVideo = videoId => io.to(users[socket.id].room).emit('update-client-video', {videoId: videoId});

    const startStreamingVideo = videoId => io.to(users[socket.id].room).emit('start-video', {videoId: videoId}); 
    // const playVideo = io.to(users[socket.id].room).emit('play-video', {command: 'play'});
    // const pauseVideo = io.to(users[socket.id].room).emit('pause-video', {command: 'pause'});
    // const updateVideoTime = videoTime => io.to(users[socket.id].room).emit('update-video-time', {time: videoTime});

    const handleRoomVideoQueueLogic = (room, videoId) => {

        // if there is a room with videos queued up already
        if(videos[room]) {

            // verify this video id is not already in this room's queue
            if(!videos[room].queue.includes(videoId)) {
               videoRoom.queue.push(videoId);
            } 
            
            // handle duplicate video
            else {
                console.log(`Duplicate Video Id ${videoId} was not pushed to ${room} video queue`);
            }
        }  
         
        // initialize a video room queue
        else {
            videos[room] = {queue: [videoId]}; 
        } 
    } 

    socket.on('add-video-to-server-queue', videoId => {
        console.log('recieved Stream message. Video Id:', videoId);
        const room = users[socket.id].room;
        handleRoomVideoQueueLogic(room, videoId);

        if(videos[room].queue.length === 1) {
            updateClientVideo(videoId);
            startStreamingVideo(videoId)
        }
        console.log('server video queue:', videos);
    })  
 
    socket.on('video-end', () => {
        videos.shift();
        if(videos) {
            updateClientVideo(videos[0]);
            startStreamingVideo(videos[0]);
        }
    })

}; 
     
 
module.exports = {
    setupStreamListener: (socket, io, users) => {
        addStreamListener(socket, io, users);
    },
    clearRoomQueue: room => {
        videos[room].queue.length = 0;
        console.log(`${room} queue has been emptied.`);
    },
} 