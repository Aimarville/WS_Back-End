const dotenv = require('dotenv');

dotenv.config();

function required(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Environment variable ${name} is required`);
    }
    return value;
}

function number(name, defaultValue) {
    const value = process.env[name];
    if (!value) return defaultValue;

    const parsed = Number(value);
    if (isNaN(parsed)) {
        throw new Error(`Environment variable ${name} must be a number`);
    }
    return parsed;
}

const config = {
    server: {
        port: number('PORT', 3000),
    },

    database: {
        uri: required('MONGO_URI'),
    },

    session: {
        secret: required('SESSION_SECRET'),
    },
};

module.exports = config;
