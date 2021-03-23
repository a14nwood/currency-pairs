const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

app.get('/test', (req, res) => {
  res.json({ message: 'This is the message!' });
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
