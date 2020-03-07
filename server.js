const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/api/users', (req, res, next) => {
    try {

    }
    catch(){
        
    }
});
db.sync().then(() => {
  app.listen(PORT, () => console.log('listening to port 3000'));
});
