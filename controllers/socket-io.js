exports.init = function(io) {
    io.sockets.on('connection', function (socket) {
        try {
            socket.on('join', function (room) {
                socket.join(room);
                io.sockets.to(room).emit('joined', room);
            });

            socket.on('comment', function (room, data) {
                io.sockets.to(room).emit('comment', room, data);
            });
        } catch (e) {
            console.log(e);
        }
    });
}
