const { gql } = require('apollo-server-express')

const typeDefs = gql`
 type User  {
    _id: ID
    username: String
    password: String
    email: String
    Posts: [Post]
 }

 type Post {
    _id: ID
    PostText: String
    Username: String
    createdAt: String
 }

 type Auth {
    token: ID!
    user: User
 }

 type Query {
    me: User
    users: [User]
    user(username: String!): User
    posts(username: String): [Post]
    post(_id: ID!): Post
 }

 type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addPost(postText: String!): Post
 }

`;

module.exports = typeDefs;