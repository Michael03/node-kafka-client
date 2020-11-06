const net = require("net");
const {ApiRequest} = require("./ApiRequest");

let apiVersion = [];

const socket = new net.Socket({ readable: true, writable: true });
let apiRequest = new ApiRequest("a", "a");



socket.connect(9092, "kafka", () => {
    let buf = apiRequest.getBuffer();
    socket.write(buf);
    socket.write(buf);
    console.log(`sending buf ${JSON.stringify(buf.toJSON())}`);
})

socket.on("error", (err) => {
    console.log(`got error ${err.message} ${JSON.stringify(err)} stack ${err.stack}`);
})

socket.on("data", (data) => {
    // console.log(data.toJSON())
    console.log(`got data ${data.length}`);
    const size = data.readInt32BE(0);
    const errorCode = data.readInt16BE(4);
    const corrId = data.readInt32BE(6);
    console.log(`corelation id: ${corrId}`)
    const arraySize = data[10] - 1;
    console.log(`arraySize ${arraySize}`);
    console.log(`size ${size}`)
    console.log({errorCode})
    const padding = 11;
    for (i = 0; i < arraySize ; i++) {
        let key = data.readInt16BE((i*7)+padding)
        let min = data.readInt16BE((i*7)+2+padding)
        let max = data.readInt16BE((i*7)+4+padding)
        let tagged = data.readInt8((i*7) +6);
        // console.log({key, min , max, tagged});
        apiVersion.push({key, min, max})
    }
    // let key = data.readInt16BE(6)
    // let min = data.readInt16BE(8)
    // let max = data.readInt16BE(10)
    // console.log({key, min , max});
    // let tagged = data[i+6];
    console.log(`throttle time ms ${data.readInt32BE((i*7)+padding)}`)
    console.log(`tagged ${data.readInt8((i*7)+padding+4)}`);
    console.log(`result ${JSON.stringify(apiVersion)}`)

    // console.log(`throttle time ms ${data.readInt32BE(i+1)}`)
})
