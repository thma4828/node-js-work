var express = require('express');
var app = express();
var mysql = require('mysql');

var myConnection = require('express-myconnection');

var config = require('./config');

var dbOptions = {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    port: config.database.port,
    database: config.database.db
};

/*pool connection to database*/

app.use(myConnection(mysql, dbOptions, 'pool'));

/*set up template engine*/
app.set('view engine', 'ejs');

/*import routes*/
var homepage = require('./routes/homepage');
var search_db = require('./routes/seach_db');

/*validate express for forms */
var expressValidator = require('express-validator');
app.use(expressValidator())

/*body parser module is used to read HTTP POST data reads a forms input and store it as a javascript object. reduces our work of parsing values from POST responses.*/

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*This mod will let us use HTTP verbs such as PUT or DELETE in places where they are not supported*/
var methodOverride = require('method-override');

/*override a method using custom logic*/
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

/* This Module uses flash messages, generally used to show succes or error messages*/
/*we also must install cookie parse and session module */
var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser('csci3308'));
app.use(session({
 secret: 'CS',
 resave: false,
 saveUninitialized: true,
 cookie: { maxAge: 60000 }
}))
app.use(flash());

app.use('/', homepage);
app.use('/search', search_db);

var hostName = config.server.host;
var serverPort = config.server.port;
app.listen(serverPort, function(){
    console.log('Server running at port ' + serverPort + '  @ http://' + hostName);

});

