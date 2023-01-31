let config = {    
    uri: "mongodb://localhost:27017/DB-Name",
    options: {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
}

module.exports = config
