const { User, Post } = require('../models');
const { AuthenticationError } = require('apollo-server-express'
);
const { signToken } = require('../utils/auth');
const { update } = require('../models/User');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('posts');
                return userData;
            }
            throw new AuthenticationError('You are not logged in.')
        },
        users: async () => {
            return User.find()
            .select('-__v -password')
            .populate('posts');
        },
        posts: async (parent, { username }) => {
            const params = username ? { username } : {};
            return Post.find(params).sort({ createdAt: -1});
        },
        post: async (parent, { _id }) => {
            return Post.findOne({ _id });
        },
        user: async (parent, { username }) => {
            return User.findOne({ username })
            .select('-__v -password')
            .populate('posts');
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { username, password }) => {
            const user = await User.findOne({ username });
            if (!user) {
                throw new AuthenticationError('Incorrect username or password.');
            }
            const correctPassword = await user.isCorrectPassword(password);
            if(!correctPassword) {
                throw new AuthenticationError('Incorrectr username or password.');
            }
            const token = signToken(user);
            return { token, user };
        },
        addPost: async ( parent, args, context) => {
            if (context.user) {
                const post = await Post.create({ ...args, username: context.user.username });
                await User.findByIdAndUpdate(
                    { _id: context.user.id },
                    { $push: { posts: post._id } },
                    { new: true }
                );
                return post;
            }
            throw new AuthenticationError('You are not logged in.')
        }
    }
};

module.exports = resolvers;