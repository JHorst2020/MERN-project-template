module.exports = {
    environment: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
    db:{
        dbURL: process.env.DATABASE_URL
    },
    jwtConfig:{
        secret:process.env.JWT_ACCESS_TOKEN_SECRET,
        refresh:process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    }
}