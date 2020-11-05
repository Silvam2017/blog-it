const { Schema, model } = require(mongoose);
const moment = require('moment');

const postSchema = new Schema({
    postText: {
        type: String,
        required: 'Your post must say something.',
        minlength: 1,
        maxlength: 2500
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: timestamp => moment(timestamp).format('YYYY-MM-DD')
    }
});

const Post = model('Post', postSchema);
module.exports = Post;