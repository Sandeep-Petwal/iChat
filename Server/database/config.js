module.exports = {
    database: process.env.DATABASE || 'chat',
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || 'sandeep51',
    host: process.env.DATABASE_HOST || 'localhost',
    dialect: process.env.DATABASE_DIALECT || 'mysql',
}