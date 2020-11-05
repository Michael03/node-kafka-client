const net = require("net");

const socket = new net.Socket({ readable: true, writable: true });
const buf = Buffer.alloc(14);
buf.writeInt32BE(10) // Size
buf.writeInt16BE(18, 4); // APi key 
buf.writeInt16BE(2, 6); // api version
buf.writeInt32BE(12342, 8); // correlation id
buf.writeInt16BE(-1, 12); // client id


console.log(buf.toJSON())

socket.connect(19092, "localhost", () => {
    console.log("connected");
    socket.write(buf)
    console.log("sending");
})
socket.on("error", (err) => {
    console.log(`got error ${err.message} ${JSON.stringify(err)} stack ${err.stack}`);
})

socket.on("data", (data) => {
    // console.log(`got data ${data}`);
    const size = data.readInt32BE(0);
    const errorCode = data.readInt16BE(4);
    console.log({errorCode})
    console.log(`size ${size}`)
    for (i = 8; i <= size-4; i+= 6) {
        console.log(i)
        let key = data.readInt16BE(i)
        let min = data.readInt16BE(i+2)
        let max = data.readInt16BE(i+4)

        console.log({key, min , max});
    }
    console.log(i);
    console.log(`throttle time ms ${data.readInt32BE(i)}`)
    // console.log(`throttle time ms ${data.readInt32BE(i+1)}`)
})