const express = require("express");
const app = express();
app.use(express.json());

var mysql = require("mysql");
var conn = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "cubethon",
});

conn.connect(function (err) {
	if (err) {
		console.error("error connecting: " + err.stack);
		return;
	}
	console.log("connected with the database");
});

const botName = "Cubethon Bot";

const registerUsers = () => {
	return (req, res) => {
		console.log(req.params.username);
		let username = req.body.username;
		let email = req.body.uemail;
		let password = req.body.upassword;
		var sql = `INSERT INTO users(id, username, password, email) VALUES ('','${username}','${password}','${email}');`;
		// var sql = "select * from users";
		conn.query(sql, function (err, result) {
			if (err) throw err;
			console.log(result);
			res.redirect("/pages/timer.html");
		});
	};
};

const signinUsers = () => {
	return (req, res) => {
		// Capture the input fields
		let email = req.body.email;
		let password = req.body.password;
		// Ensure the input fields exists and are not empty
		if (email && password) {
			// Execute SQL query that'll select the account from the database based on the specified username and password
			conn.query(
				"SELECT * FROM users WHERE email = ? AND password = ?",
				[email, password],
				function (error, results, fields) {
					// If there is an issue with the query, output the error
					if (error) throw error;
					// If the account exists
					if (results.length > 0) {
						// Authenticate the user
						req.session.loggedin = true;
						req.session.email = email;
						// Redirect to home page
						res.redirect("/pages/timer.html");
					} else {
						res.send("Incorrect Username and/or Password!");
					}
					res.end();
				},
			);
		} else {
			res.send("Please enter Username and Password!");
			res.end();
		}
	};
};

const getTimer = () => {
	return (req, res) => {
		// If the user is loggedin
		if (req.session.loggedin) {
			// Output username
			res.send("Welcome back, " + req.session.email + "!");
		} else {
			// Not logged in
			res.send("Please login to view this page!");
		}
		res.end();
	};
};

module.exports = { registerUsers, signinUsers, getTimer };
