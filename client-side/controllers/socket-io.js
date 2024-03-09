exports.init = function(io) {
    io.sockets.on('connection', function (socket) {
        console.log("try");
        try {
            /**
             * create or joins a room
             */
            socket.on('create or join', function (room, userId) {
                socket.join(room);
                io.sockets.to(room).emit('joined', room, userId);
            });

            socket.on('comment', function (room, userId, chatText) {
                io.sockets.to(room).emit('comment', room, userId, chatText);
            });
        } catch (e) {
            console.log(e);
        }
    });
}
