module.exports = {
    port: 3081,
    baseURL: 'localhost',
    userStorage: {
        secret: 'topgear',
        connString: 'mongodb://localhost/testDatabase1'
    },
    docStorage: {
        connString: "mongodb://localhost:27017/5-terre"
    }
};