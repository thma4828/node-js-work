var mysql = require('mysql');
var express = require('express');
var app = express();

//create connection variable with mySQL module.
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rythmic8480',
    database: 'northwinds'
});

con.connect(function(err) {
        if(err) throw err;
        console.log('connection to northwinds successful');
});

//default get request to myip:8080/
app.get('/', function(req, res) {
        res.sendFile("C:/Users/tsmar/Desktop/ComplexQueries/comp.html");
});

//for first query from comp.html 
app.get('/query_one', function(req, res) {
    var tableName = req.query.TableName;
    console.log(tableName);
    switch(tableName){
        case "orders":
            res.sendFile("C:/Users/tsmar/Desktop/ComplexQueries/comp2.html");
            //res.end();
            break;
        case "customers":
            res.sendFile("C:/Users/tsmar/Desktop/ComplexQueries/comp3.html");
            //res.end();
            break;
        case "employees":
            res.sendFile("C:/Users/tsmar/Desktop/ComplexQueries/comp4.html");
            //res.end();
            break;
        default:
            res.end();
    }
});

app.get('/query_one_b', function(req, res){
    var include_oid = req.query.OID;
    var include_cid = req.query.CID;
    var include_od = req.query.OD;
    var include_freight = req.query.FR;
    var all = 0;
    console.log(include_oid, include_cid, include_od, include_freight);
    var s1 = "select ";
    if(!(include_oid && include_cid && include_od && include_freight)){
        if(include_oid && (include_cid || include_od || include_freight)){
            s1 += "OrderID, ";
        }else if(include_oid && !(include_cid || include_od)){
            s1 += "OrderID ";
        }

        if(include_cid && (include_od || include_freight)){
            s1 += "CustomerID, ";
        }else if(include_cid && !(include_od || include_freight)){
            s1 += "CustomerID ";
        }

        if(include_od && include_freight){
            s1 += "OrderDate, ";
        }else if(include_od && !include_freight){
            s1 += "OrderDate ";
        }

        if(include_freight){
            s1 += "Freight ";
        }



    }else{
        s1 += "* ";
        all = 1;
    }

    console.log("query string so far constructed: ", s1);

    var specify_sc = req.query.SSC;
    var ship_c = ' ';
    var minS=' ';
    var maxS=' ';
    var minint = -1;
    var maxint = -1;
    var specify_fr = req.query.LBF;
    if(specify_sc){
        ship_c = req.query.ShipCountry;
    }
    if(specify_fr){
        minS = req.query.minf;
        maxS = req.query.maxf;
        minint = parseInt(minS);
        maxint = parseInt(maxS);
    }

    if(specify_sc && !specify_fr){
        s1 += "from nworders where ShipCountry = ";
        s1 += "'" + ship_c + "'";
    }
    if(specify_sc && specify_fr){
        s1 += "from nworders where ShipCountry = ";
        s1 += "'" + ship_c + "'";
        
        s1 += " and ";
        s1 += "Freight > " + minint +" and Freight < " + maxint + ";";
    }
    if(specify_fr && !specify_sc){
        s1 += "from nworders where Freight >= " + minint + " and Freight <= " + maxint + ";";
    }
    if(!specify_fr && !specify_sc){
        s1 += "from nworders;";
    }
    console.log("query string so far |", s1, "|");
    con.query(s1, function(err, rows, fields){
        if(err) throw err;
        var response_ = '<h1>results of query listed below</h1><br>';
        var length = rows.length;
        if(all == 1){ //if we chose to select all fields. this is the easy case
            for(j=0; j<length; j++){
                response_ += '<br>';
                response_ += '<h3>The Order ID: </h3>' + rows[j].OrderID +'<br>';
                response_ += '<h3>The Customer ID: </h3>' + rows[j].CustomerID + '<br>';
                response_ += '<h3>The Order Date: </h3>' + rows[j].OrderDate + '<br>';
                response_ += '<h3>Freight: </h3>' + rows[j].Freight + '<br>';
            }
            res.send(response_);
        }else{
            if(include_oid && include_cid && include_od && !include_freight){
                for(j=0; j<length; j++){
                    response_ += '<br>';
                    response_ += '<h3>The Order ID: </h3>' + rows[j].OrderID +'<br>';
                    response_ += '<h3>The Customer ID: </h3>' + rows[j].CustomerID + '<br>';
                    response_ += '<h3>The Order Date: </h3>' + rows[j].OrderDate + '<br>';
                }
                res.send(response_);

            }else if(include_oid && include_cid && !include_od && !include_freight){
                   for(j=0; j<length; j++){
                    response_ += '<br>';
                    response_ += '<h3>The Order ID: </h3>' + rows[j].OrderID +'<br>';
                    response_ += '<h3>The Customer ID: </h3>' + rows[j].CustomerID + '<br>';
                    
                }
                res.send(response_);
            }else if(include_oid && !include_cid && !include_od && !include_freight){
                for(j=0; j<length; j++){
                    response_ += '<br>';
                    response_ += '<h3>The Order ID: </h3>' + rows[j].OrderID +'<br>';
                }
                res.send(response_);

            }else if(include_oid && include_cid && !include_od && include_freight){
                for(j=0; j<length; j++){
                    response_ += '<br>';
                    response_ += '<h3>The Order ID: </h3>' + rows[j].OrderID +'<br>';
                    response_ += '<h3>The Customer ID: </h3>' + rows[j].CustomerID + '<br>';
                    response_ += '<h3>Freight: </h3>' + rows[j].Freight + '<br>';
                }
                res.send(response_);
            
            }else if(!include_oid && include_cid && include_od && include_freight){
                for(j=0; j<length; j++){
                    response_ += '<br>';
                    response_ += '<h3>The Customer ID: </h3>' + rows[j].CustomerID + '<br>';
                    response_ += '<h3>The Order Date: </h3>' + rows[j].OrderDate + '<br>';
                    response_ += '<h3>Freight: </h3>' + rows[j].Freight + '<br>';
                }
                res.send(response_);

            }else if(include_oid && !include_cid && include_od && include_freight){
                for(j=0; j<length; j++){
                    response_ += '<br>';
                    response_ += '<h3>The Order ID: </h3>' + rows[j].OrderID +'<br>';
                    response_ += '<h3>The Order Date: </h3>' + rows[j].OrderDate + '<br>';
                    response_ += '<h3>Freight: </h3>' + rows[j].Freight + '<br>';
                }
                res.send(response_);
            }else if(!include_oid && include_cid && !include_od && !include_freight){
                for(j=0; j<length; j++){
                    response_ += '<br>';
                    response_ += '<h3>The Customer ID: </h3>' + rows[j].CustomerID + '<br>';
                }
                res.send(response_);
            }else if(!include_oid && !include_cid && include_od && !include_freight){
                for(j=0; j<length; j++){
                    response_ += '<br>';
                    response_ += '<h3>The Order Date: </h3>' + rows[j].OrderDate + '<br>';
                }
                res.send(response_);
            }else if(!include_oid && !include_cid && !include_od && include_freight){
                for(j=0; j<length; j++){
                    response_ += '<h3>Freight: </h3>' + rows[j].Freight + '<br>';
                }
                res.send(response_);
            }else if(!include_oid && include_cid && !include_od && include_freight){
                for(j=0; j<length; j++){
                    response_ += '<h3>The Customer ID: </h3>' + rows[j].CustomerID + '<br>';
                    response_ += '<h3>Freight: </h3>' + rows[j].Freight + '<br>';   
                }
                res.send(response_);
            }else if(include_oid && !include_cid && include_od && !include_freight){
                for(j=0; j<length; j++){
                    response_ += '<h3>The Order ID: </h3>' + rows[j].OrderID +'<br>';
                    response_ += '<h3>The Order Date: </h3>' + rows[j].OrderDate + '<br>';
                }
                res.send(response_);
            }else if(include_oid && !include_cid && !include_od && include_freight){
                for(j=0; j<length; j++){
                    response_ += '<h3>The Order ID: </h3>' + rows[j].OrderID +'<br>';
                    response_ += '<h3>Freight: </h3>' + rows[j].Freight + '<br>';   
                }
                res.send(response_);
            }else if(!include_oid && include_cid && include_od && !include_freight){
                for(j=0; j<length; j++){
                    response_ += '<h3>The Customer ID: </h3>' + rows[j].CustomerID + '<br>';
                    response_ += '<h3>The Order Date: </h3>' + rows[j].OrderDate + '<br>';
                }
                res.send(response_);
            }else if(!include_oid && !include_cid && include_od && include_freight){
                    for(j=0; j<length; j++){
                        response_ += '<h3>The Order Date: </h3>' + rows[j].OrderDate + '<br>';
                        response_ += '<h3>Freight: </h3>' + rows[j].Freight + '<br>';   
                    }
                    res.send(response_);
            }

        }
        console.log("number of query results returned: ", length);
        con.end();
        
        
        
    });
    
});

var server = app.listen(8080, function() {
    console.log("web server listening on port: 8080 @ 127.0.0.1");
});
