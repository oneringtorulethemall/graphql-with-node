import '@babel/polyfill/noConflict';
import server from './server';

const startUpPort = process.env.PORT || 4000
server.start({
  port: startUpPort
},
  () => {
    console.log(`The server is up and running on port:${startUpPort}`);
  }
);
