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
                message.toid = rows[0].id
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
            toid: req.body.toid
        }

        connection.query('select * from message where fromid = ? or toid = ? and toid = ? or fromid = ? order by sendtime desc', 
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

        connection.query('select distinct users.id, fullname, username from users join message on users.id=message.toid where message.fromid = ?', 
        [query.id],
        (error, rows) => {
            if(!error){
                return res.status(200).json({
                    success: true,
                    message: rows.length + " users .",
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
            toid: req.body.toid,
            cursor: req.body.cursor
        }

        connection.query('select id, msg, sendtime from message where fromid = ? and toid = ? order by sendtime desc', 
        [query.id, query.toid],
        (error, rows) => {
            if(!error){
                let lastmsgs = []
                const lastmsgindex = rows.map(item => item.id).indexOf(query.cursor)

                for(let i = 0 ; i< lastmsgindex ; i++)
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