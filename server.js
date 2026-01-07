const app = require('./app');
const config = require('./src/config/index.js');
const connectDB = require("./src/config/database");

connectDB(config.database.uri);

app.listen(config.server.port, () => {
    console.log(`Server is running on http://localhost:${config.server.port}`);
});