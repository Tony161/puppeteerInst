const express = require('express');
const companiesAndVacansies = require('./in.js');
const port = process.env.PORT || 3001;

var app = express();

app.get('/', (req, res) => {
	res.send("введите параметры поиска: http://localhost:3001/jobtitle/netsuite/location/usa/ ");
})

app.get('/jobtitle/:jobtitle/location/:location/', async (req, res) => {
	res.json(await companiesAndVacansies(req.params.jobtitle, req.params.location));
})

app.listen(port, () => {
	console.log(`Server listening on port ${port}!`);
})
