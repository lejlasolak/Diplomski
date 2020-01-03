const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimiter = require('./middleware/rate-limiter');
const rateLimiterMiddleware = rateLimiter.rateLimiterMiddleware;

const app = express();

const https = require('https');
const fs = require('fs');
const privateKey = fs.readFileSync('/etc/ssl/private/nginx.key', 'utf8');
const certificate = fs.readFileSync('/etc/ssl/certs/nginx.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use('/api', require('./RestApi/routes'));
app.use(rateLimiterMiddleware);

const server = https.createServer(credentials, app);

server.listen(process.env.PORT || 8000);