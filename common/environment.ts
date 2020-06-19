export const environment = {
    db: {
        url: process.env.DB_URL || 'mongodb://localhost/come-come-api'
    },

    server: {
        port: process.env.SERVER_PORT || 3000,
    },

    security: {
        saltRounds: process.env.SALT_ROUNDS || 10
    }
}