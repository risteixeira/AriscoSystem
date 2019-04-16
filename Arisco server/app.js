/*-------------------------------------------------------
------------------ ARISCO SERVER  -----------------------
------- ANA TEIXEIRA  ---- 10 SEPTEMBER -----------------
---------------------------------------------------------
*/

const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

//Create connection
const db = mysql.createConnection({
	host : 'db.tecnico.ulisboa.pt',
	user: 'ist1712345',
	password : '123456',
	database : 'ist1712345',
});

//Connect
db.connect((err) => {
	if(err){
		throw err;
	}
	console.log("mySQL connect");

});


var router = new express.Router();
const app = express();
app.use(router);
app.use(express.logger('dev'));
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/*+json' }));
var util = require('util');

app.use(function (req, res, next) {
 	//comment / uncomment for acess localhost or other site
    res.setHeader('Access-Control-Allow-Origin','http://web.tecnico.ulisboa.pt');
    //res.setHeader('Access-Control-Allow-Origin','http://localhost');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.all('/missingQuest', function(req, res){
	console.log("/missingQuest enter");
	var dataReceived = req.body;
	var pacientId  = parseInt(dataReceived.patId);
	let mysql = util.format('select questionId, response from responses where pacientID = "%d" AND evaluationdate = (select max(evaluationdate) from responses Where pacientId = "%d");', pacientId,pacientId);
	db.query(mysql, function(err, result, fields){
		if(err) throw err;
		infoToSend = result;
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(infoToSend));
		console.log("/missingQuest ok!");
	});
});

app.post('/infoLastPage', function(req, res){
	console.log("/infoLastPage enter");
	var dataReceived = req.body;
	var pacientId  = parseInt(dataReceived.patId);
	let mysql = util.format('select questionId,response from responses where pacientID = "%d" AND evaluationdate = (select max(evaluationdate) from responses Where pacientId = "%d");', pacientId,pacientId);
	db.query(mysql, function(err, result, fields){
		if(err) throw err;
		infoToSend = result;
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(infoToSend));
			console.log("/infoLastPage ok!");
	});
});


app.post('/getLastEvals', function(req, res){
	console.log("/getLastEvals enter");
	var dataReceived = req.body;
	var pacientId  = parseInt(dataReceived.patId);
	let mysql = util.format('select evaluationDate from evaluations where pacientID = %d;',pacientId);
	db.query(mysql, function(err, result, fields){
		if(err) throw err;
		infoToSend = result;
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(infoToSend));
			console.log("/getLastEvals ok!");
	});
});

app.post('/evalLastLevels', function(req, res){
	console.log("/evalLastLevels enter");
	var dataReceived = req.body;
	var pacientId  = parseInt(dataReceived.patId);
	let mysql = util.format('select medicEvalSuicide,medicEvalAutoagress,medicEvalHeteroagress,medicEvalEscape,medicEvalPatology from evaluations where pacientID = "%d" AND evaluationdate = (select max(evaluationdate) from evaluations Where pacientId = "%d");', pacientId,pacientId);
	db.query(mysql, function(err, result, fields){
		if(err) throw err;
		infoToSend = result;
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(infoToSend));
		console.log("/evalLastLevels ok!");
	});
});


app.post('/changeResponse', function(req, res){
	console.log("/changeResponse enter");
	var dataReceived = req.body;
	var pacientId  = parseInt(dataReceived.patId);
	var questionC = parseInt(dataReceived.questionToChange);
	var responseC = parseInt(dataReceived.responseToChange);
	let mysql = util.format('UPDATE responses SET response=%d WHERE pacientId=%d and questionId=%d;', responseC,pacientId,questionC);
	db.query(mysql, function(err, result, fields){
		if(err) throw err;
		res.send("OK");
		console.log("/changeResponse ok");
	});
});


function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}
 
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};


app.all('/end', function(req, res){
	console.log("/end enter");
	var MyDate = new Date();
	var dateTime = MyDate.toMysqlFormat(); //return MySQL Datetime format
	var dataReceived = req.body;
	var keys = Object.keys(dataReceived);
	var pacientId  = parseInt(dataReceived.patientId);
	if(keys.length> 0){
		let mysql = util.format('insert into evaluations values (%d,?,"%s","%s","%s","%s","%s","%s","%s","%s","%s","%s");', pacientId, dataReceived.suicideTree, dataReceived.agressTree,dataReceived.heteroTree,dataReceived.escapeTree,dataReceived.patalogicTree,dataReceived.suicideDoctor,dataReceived.agressDoctor,dataReceived.heteroDoctor,dataReceived.escapeDoctor,dataReceived.patologicDoctor);
		db.query(mysql,dateTime, function(err, result, rows){
			if(err) throw err;
			for(index = 0; index < keys.length; index++){
				if(keys[index].indexOf("Quest") !== -1){
					var questionId = parseInt(keys[index].split('_')[1]);
					var response = dataReceived[keys[index]];
					let sql = util.format('INSERT INTO responses values (%d,?,%d,%d);',pacientId,questionId,response);
					db.query(sql,dateTime, function(err, result, rows){
						if(err) throw err;
					});
				}
			}
		});
	}
	res.send("This is end point");
	console.log("/end ok!");;
});

app.get('/lastPage', function(req, res){
	console.log('/infoLastPage enter');
	var infoToSend;
	db.query("SELECT * FROM questions", function(err, result, fields){
		if(err) throw err;
		infoToSend = result;
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(infoToSend));
		console.log('/infoLastPage ok!');
	});
});


app.post('/findId', function(req, res){
	console.log('/findId enter');
	var dateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
	var dataReceived = req.body;
	var pacientId  = parseInt(dataReceived.patId);
	res.setHeader('Content-Type', 'application/json');
	let mysql = util.format('select * from evaluations where `pacientId` ="%d";',pacientId);
	db.query(mysql, function(err, result, rows){
			if(err){ 
				throw err;
			}else{
				if(result.length == 0){ //patient not found

						db.query("SELECT * FROM questions", function(err, result, fields){
								if(err) throw err;
								infoToSend = result;
								infoToSend.push({"fixedQuest": true});
								res.send(JSON.stringify(infoToSend));
						});
				}else{ // patient founded
						let mysqlQuest = 'select * from questions;'
						db.query(mysqlQuest, function(err, result, fields){
								if(err) throw err;
								infoToSend = result;
								infoToSend.push({"fixedQuest": false});
								res.send(JSON.stringify(infoToSend));
						});

				}
				console.log(result);
				console.log('/findId ok!');
			}
	});

});

app.get('/', function(req, res){
	console.log("INIT");
	res.writeHead(200, {"Content-Type": "text/plain"});
 	res.end("Hello from Arisco Server :)\n");
});

app.listen(port, () => {
	console.log('Server started on port ', port);
});

