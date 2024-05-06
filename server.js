const express = require('express');
const path = require('path');


const app = express();

app.listen(5001, () => {
    console.log(`App is listening on port 5001`);
});

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname,'index.html'));
});