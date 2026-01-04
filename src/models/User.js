const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 8},
    role: {type: String, enum: ['user', 'admin']}
});

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;

    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    console.log('Pasahitza hasheatua');
});

userSchema.methods.comparePassword = async function (inputPassword){
    return await bcryptjs.compare(inputPassword, this.password);
}

module.exports = mongoose.model("User", userSchema);