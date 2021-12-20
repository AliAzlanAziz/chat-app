const mysql = require('mysql2')
const config = require('../config/db')
const connection = mysql.createConnection(config.connection)
const jwt = require('jsonwebtoken')
const uuid = require('uuid')

exports.send = (req, res, next) => {
    try{
        const message = {
            id: uuid.v4(),
            toid: req.body.toid,
            tousername: req.body.tousername,
            fromid: req.body.id,
            msg: req.body.msg,
            sendtime: new Date()
        }

        if(!message.toid){
            connection.query('select id from users where username = ?', [message.tousername],
            (error, rows) => {
                message.toid = rows[0]?.id
                connection.query('insert into message(id, toid, fromid, msg, sendtime) values (?, ?, ?, ?, ?)',
                [message.id, message.toid, message.fromid, message.msg, message.sendtime],
                (error, rows) => {
                    if(!error){
                        return res.status(200).json({
                            success: true,
                            message: 'message sent'
                        })
                    }
                })
            })
        }else{
            connection.query('insert into message(id, toid, fromid, msg, sendtime) values (?, ?, ?, ?, ?)',
            [message.id, message.toid, message.fromid, message.msg, message.sendtime],
            (error, rows) => {
                if(!error){
                    return res.status(200).json({
                        success: true,
                        message: 'message sent'
                    })
                }
            })
        }
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

exports.getAllMessages = (req, res, next) => {
    try{
        const query = {
            fromid: req.body.id,
            toid: req.params.toid
        }

        connection.query('select * from message where fromid = ? and toid = ? or toid = ? and fromid = ? order by sendtime desc', 
        [query.fromid, query.toid, query.fromid, query.toid],
        (error, rows) => {
            if(!error){
                return res.status(200).json({
                    success: true,
                    message: rows.length + " messages retrieved.",
                    data: rows
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

exports.getAllUsers = (req, res, next) => {
    try{
        const query = {
            id: req.body.id,
        }

        connection.query('select distinct users.id, username, fullname from users, message where (users.id = message.fromid and message.toid = ?) or (users.id = message.toid and message.fromid = ?)', 
        [query.id, query.id],
        (error, rows) => {
            if(!error){
                return res.status(200).json({
                    success: true,
                    message: rows.length + " users.",
                    data: rows
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

exports.getLastMessages = (req, res, next) => {
    try{
        const query = {
            id: req.body.id,
            toid: req.params.toid,
            cursor: req.params.cursor
        }

        connection.query('select * from message where fromid = ? and toid = ? or toid = ? and fromid = ? order by sendtime', 
        [query.id, query.toid, query.id, query.toid],
        (error, rows) => {
            if(!error){
                if(query.cursor == 0){
                    return res.status(200).json({
                        success: true,
                        message: rows.length + " last messages",
                        data: rows
                    })
                }

                let lastmsgs = []
                const lastmsgindex = rows.map(item => item.id).indexOf(query.cursor)

                for(let i = 0 ; i < lastmsgindex ; i++)
                {
                    lastmsgs.push(rows[i])
                }

                return res.status(200).json({
                    success: true,
                    message: lastmsgs.length + " last messages",
                    data: lastmsgs
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