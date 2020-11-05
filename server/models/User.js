const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userschema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'User must enter a valid email address.']
    },
    Posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
},
{
    toJSON: {
        virtuals: true
    }
}
);

// Virtuals allows us to count number of posts created by user
userSchema.virtual('postcount').get(function() {
    return this.posts.length;
});

userSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

// Check password provided by user with stored encrypted password
userSchema.methods.isCorrectPassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;