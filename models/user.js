const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    firstName: { type: String, required: [true, 'cannot be empty' ]},
    lastName: { type: String, required: [true, 'cannot be empty' ]},
    email: { type: String, required: [true, 'cannot be empty' ], unique: [true,'this email address has been used']},
    password: { type: String, required: [true, 'cannot be empty' ]},

});

//replace the plain text password with a hashed password before saving the document in the database
//pre middleware

userSchema.pre('save', function(next){
    let user = this;
    if (!user.isModified('password')) 
            return next();
    bcrypt.hash(user.password, 10)
    .then(hash=>{
        user.password = hash;
        next();
    })
    .catch(err=>next(err));
});

// implement a method to compare the login password and the hash stored in the database

userSchema.methods.comparePassword = function(loginPassword){
    let user = this;
    return bcrypt.compare(loginPassword, user.password);
};


module.exports = mongoose.model('User', userSchema);
