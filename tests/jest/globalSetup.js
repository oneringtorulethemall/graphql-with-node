require('@babel/register');
require('@babel/polyfill/noConflict');
const server = require('../../src/server').default;


// console.log(server);
module.exports = async () => {
    const startUpPort = process.env.PORT || 4000
    const instance = await server.start({
        port: startUpPort
    });
    global.httpServer = instance;
    console.log(`The server is up and running on port:${startUpPort}`);
}