const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');

dotenv.config({ path: './config/config.env' });

const auth = require('./routes/auth');
const message = require('./routes/message');

const app = express();

app.use(express.json());

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/v1/auth', auth);
app.use('/api/v1/message', message);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('front/build'));

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'front', 'build', 'index.html')));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));