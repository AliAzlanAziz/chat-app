const mysql = require('mysql2')
const config = require('../config/db')
const connection = mysql.createConnection(config.connection)
const uuid = require('uuid')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

exports.register = (req, res, next) => {
    try{
        const user = {
            id: uuid.v4(),
            fullname: req.body.fullname,
            username: req.body.username,
            pass: bcrypt.hashSync(req.body.password, saltRounds)
        }

        connection.query("select * from users where username = ?", [user.username], (error, rows) => {
            if(rows.length>0){
                return res.status(403).json({
                    success: false,
                    message: 'Username already exist'
                })
            }
        })
        
        connection.query("insert into users(id, fullname, username, pass) values (?, ?, ?, ?)", 
        [user.id, user.fullname, user.username, user.pass], 
        (error, rows) => {
            if(!error){
                return res.status(200).json({
                    success: true,
                    message: 'Successfully signed up'
                })
            }
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

exports.login = (req, res, next) => {
    try{
        const user = {
            username: req.body.username,
            pass: req.body.password
        }

        connection.query("select id, pass from users where username = ?", [user.username], async (error, rows) => {
            if(rows.length<1){
                return res.status(404).json({
                    success: false,
                    message: 'No User exist'
                })
            }else{
                const match = await bcrypt.compare(user.pass, rows[0].pass)

                if(match){
                    const token = jwt.sign({ id: rows[0].id }, process.env.SECRET_KEY) 

                    return res.status(200).json({
                        success: true,
                        message: 'Successfully logged in',
                        token: token
                    })
                }else{
                    return res.status(401).json({
                        success: false,
                        message: 'Wrong Credentials',
                    })
                }
            }
        })
    }catch(err){
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        })
    }
}

// exports.helloworld = (req, res, next) => {
//     return res.status(200).json({
//         success:true,
//         message:"helloworld"
//     })
// }