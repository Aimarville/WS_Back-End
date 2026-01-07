const app = require('./app');
const config = require('./src/config/index.js');

app.listen(config.server.port, () => {
    console.log(`Server is running on http://localhost:${config.server.port}`);
});