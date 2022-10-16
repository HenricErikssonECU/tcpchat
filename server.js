const net = require('net');

let sockets1 = [];
let sockets2 = [];

const broadcast1 = (data, socketSent) => {
    if(data === 'quit'){
        sockets1.splice(sockets1.indexOf(socketSent), 1);
    } else{
        sockets1.forEach(socket => {
            if(socket !== socketSent){
                socket.write(data);
            }
        });
    }
}

const broadcast2 = (data, socketSent) => {
    if(data === 'quit'){
        sockets2.splice(sockets2.indexOf(socketSent), 1);
    } else{
        sockets2.forEach(socket => {
            if(socket !== socketSent){
                socket.write(data);
            }
        });
    }
}


const server1 = net.createServer(socket => {
    sockets1.push(socket);
    console.log(`A client connected to Chat #1.`);

    socket.on('data', message => {
        broadcast1(message, socket);
    });

    socket.on('close', () => {
        console.log('A client has left the #1 chat');
    });

    socket.on('error', err => {
        console.log(' "error" #1 chat' + err);
    });

});

const server2 = net.createServer(socket => {
    sockets2.push(socket);
    console.log(`Client connected to Chat #2!`);

    socket.on('data', message => {
        broadcast2(message, socket);
    });

    socket.on('close', () => {
        console.log('A client has left the #2 chat');
    });

    socket.on('error', err => {
        console.log(' "error" #2 chat' + err);
    });

});


server1.listen(3000, () => {console.log('server 1 (Chat #1) is listening to port: 3000')});
server2.listen(3123, () => {console.log('server 2 (Chat #2) is listening to port: 3123')});