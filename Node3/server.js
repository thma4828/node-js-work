var mysql = require('mysql');
var express = require('express');
var app = express();

//create connection variable with mySQL module.
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rythmic8480',
    database: 'tshirtsdb'
});
//try to connect to tshirtsdb, throw an error if connection fails.
con.connect(function(err) {
    if(err) throw err;
    console.log("connected to tshirtsdb database");
});
//default get of domain name with no /file request. respond to the get request with the file tshirtfront.html 
app.get('/', function(req, res) {
	res.sendFile("C:/Users/tsmar/Desktop/Node3/tshirtfront.html");
});
//my forms.html interface
app.get('/forms.html', function(req, res) {
    res.sendFile("C:/Users/tsmar/forms.html");
});

app.get('/search_name', function(req, res) {
    var productName = req.query.productName; /* get user input from forms.html html form*/
    console.log("the entry from the user: " + productName);
    var query_string = 'SELECT product_name, product_price, size, inventory FROM menstees WHERE product_name = ' + "'" + productName + "'" + ';';
    var pname = "";
    var pprice = 0;
    var psize = 0;
    var pinv = 0;
    con.query(query_string, function(err, rows, fields){
        if(err){
            throw err;
        }
        
        pname = rows[0].product_name;
        
        pprice = rows[0].product_price;
        
        psize = rows[0].size;

        pinv = rows[0].inventory;

        res.send('<h2>Product Name:</h2><h1>' + pname + '</h2><h2>Product Price:</h2><h1>' + pprice + '</h1><h2>Product Size:</h2><h1>' + psize +'</h1><h2># In Stock</h2><h1>'+pinv+'</h1>');
        con.end();
    });
});

app.get('/search_price', function(req, res) {
    var minPrice = req.query.productMin;
    var maxPrice = req.query.productMax;
    var minInt = parseInt(minPrice);
    var maxInt = parseInt(maxPrice);
    console.log("min price: ", minInt, "\nmax price: ", maxInt);
    query_string = "SELECT product_name, product_price, size, inventory FROM menstees WHERE product_price >= " + minInt + " AND product_price <= " + maxInt + " order by product_price;";
    var pname = "";
    var pprice = 0;
    var psize = 0;
    var pinv = 0;
    con.query(query_string, function(err, rows, fields){
        if(err) throw err;
        var lim = rows.length;
        var final_response = '<h1>results of query listed below</h1><br>';
        for(i=0; i<lim; i++){
            pname = rows[i].product_name;
            pprice = rows[i].product_price;
            psize = rows[i].size;
            pinv = rows[i].inventory;
            final_response = final_response + '<br><br><h2>Product Name:</h2><h1>' + pname + '</h2><h2>Product Price:</h2><h1>' + pprice + '</h1><h2>Product Size:</h2><h1>' + psize +'</h1><h2># In Stock</h2><h1>'+pinv+'</h1>';
        }
        res.send(final_response);
        con.end();
    });
});

app.get('/login', function(req, res) {
    var userName = req.query.UserName;
    var passKey = req.query.PassKey;
    console.log('login attempt: userName: ',userName,'| passKey: ', passKey);
    query_string = "SELECT COUNT(*) AS 'CT' FROM users WHERE username = " + "'"+ userName + "'"+" AND passkey = " + "'" + passKey + "'" + ";";
    var qcount = 0;
    con.query(query_string, function(err, rows, fields){
        if(err) throw err;
        var res_string = rows[0].CT;
        var res_int = parseInt(res_string);
        if(res_int != 1){
            con.end();
        }else{
            res.send('<h1> you have been authenticated <h1>');
            con.end();
        }
    });
});

var server = app.listen(8080, function() {
    console.log("web server listening on port: 8080 @ 127.0.0.1");
});


