const express = require('express');
const resultFunc = require('./result.js');
const port = process.env.PORT || 3001;

var app = express();

app.get(`/:userName`, async (req, res) => {

	console.log(req.params.userName);
	res.json(await resultFunc(`${req.params.userName}`));
})

app.listen(port, () =>{
  console.log(`Server listening on port ${port}!`);
})
