const { Header } = require("./header");

class ApiRequest {

    constructor(clientName, clientVersion) {
        this.clientName = clientName;
        this.clientVersion = clientVersion;
    }

    getBuffer() {
        let header = new Header(18, 3, -1);
        header.setSize(5)
        header.addTagged();
        let buf = header.getBuffer();
        buf.writeUInt8(2, 15); // client name
        buf.writeInt8(this.clientName.charCodeAt(), 16); //a
        buf.writeUInt8(2, 17); // client version
        buf.writeInt8(this.clientVersion.charCodeAt(), 18); //a
        buf.writeInt8(0, 19); // tagged fields
        return buf;
    }
}
exports.ApiRequest = ApiRequest;