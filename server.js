const express = require('express');
const path = require('path');
const session = require('express-session');

const config = require('./src/config/index.js');
const authRoutes = require('./src/routes/auth.js');
const playerRoutes = require('./src/routes/player.js');
const solutionRoutes = require('./src/routes/solution.js');
const connectDB = require('./src/config/database.js');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB(config.database.uri);

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use('/auth', authRoutes);
app.use('/api', playerRoutes);
app.use('/solution', solutionRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(config.server.port, () => {
    console.log(`Server is running on http://localhost:${config.server.port}`);
});