const express = require('express');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('./src/config/passport');

const config = require('./src/config/index.js');
const authRoutes = require('./src/routes/auth.js');
const playerRoutes = require('./src/routes/player.js');
const solutionRoutes = require('./src/routes/solution.js');
const adminRoutes = require('./src/routes/admin.js');
const connectDB = require('./src/config/database.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

connectDB(config.database.uri);

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);
app.use('/api', playerRoutes);
app.use('/solution', solutionRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;