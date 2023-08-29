module.exports = {
    dbSettings: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'gps-store'
    },
    jwtSettings: {
        codePhrase: "some-secret-key"
    }
}