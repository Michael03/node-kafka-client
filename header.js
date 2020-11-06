class Header {

    constructor(apiKey, apiVersion, clientId) {
        this.apiKey = apiKey;
        this.apiVersion = apiVersion;
        this.clientId = clientId;
        this.tagged = false;
        this.correlationId = Math.floor(Math.random() * 10000);
        this.size = undefined;
    }

    // Size of body
    setSize(size) {
        this.size = size;
    }

    addTagged() {
        this.tagged = true;
    }

    getBuffer() {
        let buffer = Buffer.alloc(this.getSize() + 4);
        buffer.writeInt32BE(this.getSize());
        buffer.writeInt16BE(this.apiKey, 4);
        buffer.writeInt16BE(this.apiVersion, 6);
        buffer.writeInt32BE(this.correlationId, 8);
        buffer.writeInt16BE(this.clientId, 12);
        if(this.tagged) {
            buffer.writeUInt8(0, 14); // Or write tagged fields
        }
        return buffer;
    }

    getSize() {
        return (10 + this.size) + (this.tagged ? 1 : 0);
    }
}
exports.Header = Header;