const fs = require('fs');
const dns = require('dns');

module.exports = class {
  constructor(file) {
    this.dataBuffer = undefined;
    this.load(file);
  }

  load(file) {
    if (this.dataBuffer) {
      return this.dataBuffer;
    }

    this.dataBuffer = this.loadBinaryData(file);
    return this.dataBuffer;
  }

  loadBinaryData(filepath) {
    const fd = fs.openSync(filepath, 'r');
    const chunkSize = 102400;
    const chunks = [];
    let chunkBuffer;

    let readLength = 0;
    let bufferLength = 0;

    while (true) {
      chunkBuffer = Buffer.alloc(chunkSize);
      readLength = fs.readSync(fd, chunkBuffer, 0, chunkSize, bufferLength);
      bufferLength += readLength;
      chunks.push(chunkBuffer);
      if (readLength < chunkSize) break;
    }
    fs.closeSync(fd);

    return Buffer.concat(chunks);
  };

  find(ip) {
    if (!this.dataBuffer) {
      return [];
    }

    const ipArray = ip.trim().split('.');
    const ip2long = ip => Buffer.from(ip.trim().split('.')).readInt32BE(0);
    const ipInt = ip2long(ip);

    const offset = this.dataBuffer.readInt32BE(0);
    const indexBuffer = this.dataBuffer.slice(4, offset - 4 + 4);
    const tmpOffset = ipArray[0] * 4;
    const maxCompLen = offset - 1028;
    let indexOffset = -1;
    let indexLength = -1;
    let start = indexBuffer.slice(tmpOffset, tmpOffset + 4).readInt32LE(0);

    for (start = start * 8 + 1024; start < maxCompLen; start += 8) {
      if (indexBuffer.slice(start, start + 4).readInt32BE(0) >= ipInt) {
        indexOffset = ((indexBuffer[start + 6] << 16) + (indexBuffer[start + 5] << 8) + indexBuffer[start + 4]);
        indexLength = indexBuffer[start + 7];
        break;
      }
    }
    if (indexOffset === -1 || indexLength === -1) {
      return [];
    } else {
      return this.dataBuffer.slice(offset + indexOffset - 1024, offset + indexOffset - 1024 + indexLength).toString('utf-8').split('\t');
    }
  };

  ipFind(name) {
    return new Promise((resolve, reject) => {
      dns.resolve4(name, (err, addresses) => {
        try {
          if (err) {
            resolve(this.find(name));
          } else {
            resolve(this.find(addresses.shift()));
          }
        } catch (e) {
          reject(e);
        }
      });
    });
  };
};
