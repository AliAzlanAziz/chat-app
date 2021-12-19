const fs = require('fs')

// configuring configDB.js for connection
const configDB = {
    'connection': {
        'host': 'localhost',
        'user': 'root',
        'password': 'root',
        'database': 'chatapp',
        'stringifyObjects': 'Stringify',
    },
    // conn: {
    //     host:"chatapp.mysql.database.azure.com", 
    //     user:"azure_root", 
    //     password:"Root1234", 
    //     database:"chatapp", 
    //     port:3306,
    //     ssl: {
    //         ca: fs.readFileSync('./DigiCertGlobalRootCA.crt.pem')
    //     }
    // }
}

module.exports = configDB
