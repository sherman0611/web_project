exports.init = function(io) {
    io.sockets.on('connection', function (socket) {
        // console.log("try");
        try {

        } catch (e) {
            console.log(e);
        }
    });
}