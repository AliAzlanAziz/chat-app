const mysql = require('mysql2')
const config = require('../config/db')
const connection = mysql.createConnection(config.connection)
const jwt = require('jsonwebtoken')

exports.isLoggedIn = (req, res, next) => {
    jwt.verify(req.headers.token, process.env.SECRET_KEY, (error, decode) => {
        if(error){
            return res.status(401).json({
                success: false,
                message: 'Unauthorized Access'
            })
        }

        connection.query("select username from users where id = ?", decode.id, (err, rows) => {
            if(err || rows[0]?.username==null){
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized Access'
                })
            }
            req.body.id = decode.id
            return next()
        })
    })
}