const express = require('express');
const app = express();

app.use((() => {
  return express.static(__dirname)
})());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.listen(3000, () => console.log('running'))
