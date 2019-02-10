// imports: (ES5)
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./router');
const mongoose = require('mongoose');

const app = express();
//for listening any index.js-file changes or reload browser we use npm nodemon
// pkill -f node
// DB Setup
mongoose.connect('mongodb://localhost:27017/auth', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

// App Setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);

server.listen(port);

console.log(`Server is listening on ${port}`);