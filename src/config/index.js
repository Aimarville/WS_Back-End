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

    oauth: {
        github: {
            clientId: required('GITHUB_CLIENT_ID'),
            clientSecret: required('GITHUB_CLIENT_SECRET'),
            callbackUrl: required('GITHUB_CALLBACK_URL'),
        },
        google: {
            clientId: required('GOOGLE_CLIENT_ID'),
            clientSecret: required('GOOGLE_CLIENT_SECRET'),
            callbackUrl: required('GOOGLE_CALLBACK_URL'),
        },
    },
};

module.exports = config;
