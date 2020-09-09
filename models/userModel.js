const mongoose = require('mongoose')
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please Provide a valid email!']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must not be less than 8 caracters'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            //! This only works on CREATE and SAVE and not on UPDATE
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
})

// Password encryption
userSchema.pre('save', async function (next) {
    // only run this if the password is modified
    if (!this.isModified('password')) return next();

    // hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    next();
});


userSchema.methods.correctPassword = async function (
    candidatPassword,
    userPassword
) {
    // compare Passwords
    return await bcrypt.compare(candidatPassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;