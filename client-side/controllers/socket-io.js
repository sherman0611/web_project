exports.init = function(io) {
    io.sockets.on('connection', function (socket) {
        console.log("try");
        try {
            socket.on('join', function (room) {
                socket.join(room);
                io.sockets.to(room).emit('joined', room);
            });

            // socket.on('comment', function (room, userId, chatText) {
            //     io.sockets.to(room).emit('comment', room, userId, chatText);
            // });
        } catch (e) {
            console.log(e);
        }
    });
}
