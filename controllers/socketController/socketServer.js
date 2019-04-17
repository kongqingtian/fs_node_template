
module.exports.init = (socketIo) => {
    socketIo.on(`connection`, function (client) {

        client.on(`subscribe`, function (data) {
            client.join(data); // join a room
            console.log(`received ${data}`)
            socketIo.to(data).emit(data, `Please GET info from KDS`); // emit to the room

        });

        client.on('disconnect', function (a) {
            console.log(`disconneted: ` + a)
        });
    });

}