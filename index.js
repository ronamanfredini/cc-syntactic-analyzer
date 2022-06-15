const express = require('express');
const app = express();
let reqCount = 0;

app.use((() => {
  reqCount++;
  console.log(reqCount);

  return express.static(__dirname)
})());
console.log('aaa')

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

app.listen(3000, () => console.log('running'))
