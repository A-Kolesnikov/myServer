module.exports = {
    dbSettings: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: process.env.DB_PASSWORD,
        database: 'gps-store'
    },
    jwtSettings: {
        codePhrase: process.env.JWT_SECRET,
        user_tokenLifetime: '1h',
        resetLinkLifetime: '30m'
    },
    sessionSettings: {
        codephrase: process.env.SESSION_SECRET,
        sessionLifeTime: 1000*60*60 //1hour //if null - will be deleted with closing browser
    },
    clientSettings: {
        host: 'localhost',
        port: '3000',
        url: `http://localhost:3000`
    },
    cookieSettings: {
        categoriesLifeTime: 1000*60*5 //5 min
    }
}