const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});




async function userName() {
    return new Promise((res, rej) => {
            rl.question('Choose your username: ', user => {
                if (user.length > 0) {
                    res(user.toUpperCase());
                }else{
                    console.log('Error - Invalid input (too few characters');
                    res(userName());
                }
            });
    });

}

async function serverPort() {
    return new Promise((res, rej) => {
        rl.question('Choose server port (3000 or 3123): ', port => {
            if(port === '3000' || port === '3123'){
                res(port);
            }else{
                console.log('Error - Available server ports are: 3000 and 3123');
                res(serverPort());
            }
        });
    })

}


const runClient = async () => {

    let username = await userName().catch(err => { console.log(err); });
    let portnumber = await serverPort();
    connectionFunc(username, portnumber);
}


function connectionFunc(username, portnumber) {
    const socket = net.connect({
        port: portnumber
    });
    socket.on('connect', () => {
        socket.write(`${username} has joined the chat!`)
    });
    socket.on('data', data => {
        console.log('-' + '\x1b[33m%s\x1b[0m', data);
    });
    socket.on('timeout', () => {
        socket.end();
    });
    socket.on('end', () => {
        process.exit();
    });
    socket.on('error', () => {
        console.log('-Lost connection with the server, try again later-');
        process.exit();
    });
    rl.on('line', data => {
        if (data === 'quit') {
            socket.write(`${username} has left the chat`);
            socket.setTimeout(500);
        } else {
            socket.write(`${username} says: ${data}`);
        }
    });
}


runClient();