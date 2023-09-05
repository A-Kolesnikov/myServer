module.exports = {
    dbSettings: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'gps-store'
    },
    jwtSettings: {
        codePhrase: process.env.JWT_SECRET
    },
    sessionSettings: {
        codephrase: process.env.SESSION_SECRET
    },
    clientSettings: {
        url: "http://localhost:3000"
    }
}