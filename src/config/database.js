const mongoose = require("mongoose");

const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB-ra konektatuta');
    } catch (error) {
        console.error('Errorea MongoDB-ra konektatzean:', error);
        process.exit(1);
    }
}

module.exports = connectDB;