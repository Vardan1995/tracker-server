const socketio = require("socket.io")




module.exports.listen = function (app) {
    io = socketio.listen(app)

    // users = io.of('/users')
    io.on("connection", (socket) => {///users.on("connection")
        socket.on('subscribe', function (data) {
            ///stex nenc pti anem vor token@ hastati nor toxnem join lini
            console.log('joining room', data.token, data.mysoket);

            /// mihat mianumem roomin mihatel im soketin vor viwer@ karoxana indz warning uxarki
            socket.join(data.mysoket);
            socket.join(data.room);
        });

        socket.on('sendd', function (data) {
            // console.log('sending room post', data.room);
            socket.broadcast.to(data.room).emit('image', {
                image: true, buffer: data.buf.toString('base64'), info: data.info, workerID: data.workerID
            });
        });
        socket.on('alert', function (data) {
            socket.broadcast.to(data.workerSoket).emit('message', { message: data.message });
        });


    })

    return io
}