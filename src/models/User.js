const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, minlength: 8, required: function(){ return !this.oauthProvider}},
    role: {type: String, enum: ['user', 'admin']},
    oauthProvider: { type: String, enum: ['github', 'google'], default: null},
    oauthId: { type: String, default: null}
});

userSchema.pre('save', async function() {
    if (!this.password) return;
    if (!this.isModified('password')) return;

    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    console.log('Pasahitza hasheatua');
});

userSchema.methods.comparePassword = async function (inputPassword){
    if (!this.password) return false;
    return await bcryptjs.compare(inputPassword, this.password);
}

module.exports = mongoose.model("User", userSchema);