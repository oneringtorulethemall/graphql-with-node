module.exports = async () => {
    console.log('server is shutting down.');
    await global.httpServer.close();
    console.log('server has shut down.');
};