const faker = require('faker');
const db = require('../config/connection');
const { User, Post } = require('../models');

db.once('open', async () => {
    await Post.remove({});
    await User.remove({})
    const userData = [];

    for (let i=0; i<25; i+=1) {
        const username = faker.internet.userName();
        const password = faker.internet.password();
        const email = faker.internet.email();
        userData.push({ username, password, email });
    }
    const createdUsers = await User.collection.insert(userData);

    let createdPosts = [];
    for (let i=0; i<50; i+=1) {
        const postText = faker.lorem.words(Math.round(Math.random() *10) + 1);
        const randomUserIndex = Math.floor(Math.random() * createdUsers.ops.length);
        const { username, _id: userId } = createdUsers.ops[randomUserIndex];

        const createdPost = await Post.create({ postText, username });

        const updatedUser = await User.updateOne(
            { _id: userId },
            { $push: { posts: createdPost._id } }
        );
        createdPosts.push(createdPost);
    }
    console.log('Seed complete.');
    process.exit(0);
});