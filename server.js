const express = require('express');
// const resultFunc = require('./result.js');
const companiesAndVacansies = require('./indeed.js');
const port = process.env.PORT || 3001;

var app = express();

app.get('/', (req, res) => {
	res.send("введите параметры поиска: http://localhost:3001/jobtitle/netsuite/location/usa/days/1 ");
})

app.get('/jobtitle/:jobtitle/location/:location/days/:daysToSearch', async (req, res) => {
  const {jobtitle, location, daysToSearch } = req.query;
	res.json(await companiesAndVacansies(req.params.jobtitle, req.params.location,req.params.daysToSearch));
})



app.listen(port, () => {
	console.log(`Server listening on port ${port}!`);
})
