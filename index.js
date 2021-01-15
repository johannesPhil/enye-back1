const express = require("express");
const fetch = require("node-fetch");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const https = require("https");

app.get("/", (req, res) => {
	res.send(
		`Welcome, Please make use of the '/api/rates' route. Make sure to supply the needed arguements `
	);
});

app.get("/api/rates", (req, res) => {
	const query = {
		base: req.query.base,
		currency: req.query.currency.split(","),
	};

	https
		.get(
			`https://api.exchangeratesapi.io/latest?base=${
				query.base
			}&symbols=${query.currency.join()}`,
			(resp) => {
				let data = "";

				// A chunk of data has been received.
				resp.on("data", (chunk) => {
					data += chunk;
				});

				// The whole response has been received. Wrap it in another object.
				resp.on("end", () => {
					let result = {
						results: JSON.parse(data),
					};
					res.send(result);
				});
			}
		)
		.on("error", (err) => {
			console.log("Error: " + err.message);
		});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log("Server started on PORT:5000");
});
