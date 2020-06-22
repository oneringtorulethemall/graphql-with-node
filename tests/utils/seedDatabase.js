import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../src/prisma';

const authenticationInfo = {
    // input: used to create a new user
    input1: {
        name: "Swaz",
        email: "swaz@themancave.com",
        password: bcrypt.hashSync("Abcd1234$")
    },
    // user: used to hold the return value from createUser call
    user1: {
        user: undefined,
        jwt: undefined
    },


    input2: {
        name: "jdt",
        email: "jdt043063@gmail.com",
        password: bcrypt.hashSync("Abcd1234$")
    },

    user2: {
        user: undefined,
        jwt: undefined
    },

};

const postInfo = {
    post1: undefined,
    post2: undefined
};

const commentInfo = {
    comment1: undefined,
    comment2: undefined
}


const seedDatabase = async () => {

    await prisma.mutation.deleteManyComments();

    await prisma.mutation.deleteManyPosts();

    await prisma.mutation.deleteManyUsers();

    authenticationInfo.user1.user = await prisma.mutation.createUser(
        { data: authenticationInfo.input1 }
    );

    // store jwt token
    authenticationInfo.user1.jwt = jwt.sign(
        { userID: authenticationInfo.user1.user.id },
        process.env.JWT_SECRET
    );


    authenticationInfo.user2.user = await prisma.mutation.createUser(
        { data: authenticationInfo.input2 }
    );

    authenticationInfo.user2.jwt = jwt.sign(
        { userID: authenticationInfo.user2.user.id },
        process.env.JWT_SECRET
    );



    // create some post associated with this user.
    const post1 = await prisma.mutation.createPost({
        data: {
            title: `Test Post 1 for ${authenticationInfo.user1.user.name}`,
            body: `Test Body 1 for ${authenticationInfo.user1.user.name} having ID of ${authenticationInfo.user1.user.id}`,
            published: true,
            author: {
                connect: { id: authenticationInfo.user1.user.id }
            }
        }
    });
    postInfo.post1 = post1;

    const post2 = await prisma.mutation.createPost({
        data: {
            title: `Test Post 2 for ${authenticationInfo.user1.user.name}`,
            body: `Test Body 2 for ${authenticationInfo.user1.user.name} having ID of ${authenticationInfo.user1.user.id}`,
            published: false,
            author: {
                connect: { id: authenticationInfo.user1.user.id }
            }
        }
    });
    postInfo.post2 = post2;

    // create some comments to work with
    const comment1 = await prisma.mutation.createComment(
        {
            data: {
                text: "I think that Test Post 1 is an interesting thought.",
                post: {
                    connect: { id: postInfo.post1.id }
                },
                author: {
                    connect: { id: authenticationInfo.user1.user.id }
                }
            }
        }
    );
    commentInfo.comment1 = comment1;
    console.log(commentInfo.comment1);


    const comment2 = await prisma.mutation.createComment(
        {
            data: {
                text: "I think that Test Post 2 has yet to be published.",
                post: {
                    connect: { id: postInfo.post2.id }
                },
                author: {
                    connect: { id: authenticationInfo.user2.user.id }
                }
            }
        }
    );
    commentInfo.comment2 = comment2;
    console.log(commentInfo.comment2);

};

export { seedDatabase as default, authenticationInfo, postInfo, commentInfo };