const express = require('express');
const app = express();

// This tells the server to only share files inside the 'public' folder
app.use(express.static('public'));

// This starts the server and listens for visitors on port 3000
app.listen(process.env.PORT || 3000, () => console.log('Server running on port 3000'));
