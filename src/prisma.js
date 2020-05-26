import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './resolvers/index';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: process.env.PRISMA_ENDPOINT,
    secret: process.env.PRISMA_SECRET,
    fragmentReplacements
});

// prisma.query

/*

prisma.query.users(null, '{ id name email posts { id title body } }').then(data => {

    console.log("users -------------------------");
    console.log(JSON.stringify(data, undefined, 2));
    //console.log(data);
});

prisma.query.comments(null, '{ id, text }').then(data => {
    console.log("comments -------------------------");
    console.log(JSON.stringify(data, undefined, 2));
});

*/

/*
prisma.exists.Comment({
    id: "ck9fn8mu200cn07756rcc90z1"
}).then(data => {
    console.log("data exist: " + data)
})

*/


/*
// prisma.mutation
const createPostForUser = async (authorID, data) => {

    const userExists = await prisma.exists.User({ id: authorID });
    if (!userExists) { throw new Error("User not found."); }

    const post = await prisma.mutation.createPost({
        data: {
            ...data,
            author: {
                connect: { id: authorID }
            }
        }
    }, '{ id title body published author { id name email } } ');
    return post.author;
};
*/

/*
createPostForUser('ck9e4pmmi04pe0775hb59ieiz', {
    title: 'GraphQL & Microservices in Node.js',
    body: 'This book covers using GraphQL and combining with other Microservices to represent a single source of truth.',
    published: true
}).then(data => {
    console.log(JSON.stringify(data));
}).catch(error => {
    console.log(error);
})
*/


/*
const updatePostForUser = async (postID, data) => {
    const postExists = await prisma.exists.Post({
        id: postID
    });
    if (!postExists) {
        throw new Error("Post does not exist.");
    }
    const result = await prisma.mutation.updatePost({
        data,
        where: {
            id: postID
        }
    }, '{ author { id, name email posts { id title body published} } }');

    console.log('updatePostForUser');
    console.log(JSON.stringify(result, undefined, 4));

    return result.author;

    //
    //console.log("Return value from updatePost\n", JSON.stringify(post));
    //const user = await prisma.query.user({
    //    where: {
    //        id: post.author.id
    //    }
    //}, '{ id, name, email, posts { id title body published } }');
    //return user;
    //
};
*/

/*
updatePostForUser('ck9fliqyo00560775vvd7a95g',
    {
        title: "One GraphQL flew over the Cuckoo's Nest.",
        published: false
    }
).then(data => {
    console.log(JSON.stringify(data, undefined, 2));
}).catch(error => {
    console.log(error);
});
*/


/*
prisma.mutation.createPost(
    {
        data:
        {
            title: "GraphQL 301 with MongoDB - Advanced Subscriptions with React Native",
            body: "Sample code needs to be added in order to show the 'how-to' ",
            published: true,
            author: {
                connect: {
                    id: "ck9gzykzu00l90775sffxi107"
                }
            }
        }

    },
    '{ id title body published }'
).then(data => {
    console.log(data);
    return prisma.query.users(null, '{ id name posts { id title } }')
}).then(data => {
    console.log(JSON.stringify(data, undefined, 2));
});
*/


/* mutation example
const bodyText = "Graph 301 - Simple to the Complex";
const shouldPublish = false;

prisma.mutation.updatePost(
    {
        data: {
            body: bodyText,
            published: shouldPublish
        },
        where: {
            id: "ck9jtkzni00rg07753ufev9cv"
        }
    },
    ' {id title body published author { id name }}'
).then(data => {
    console.log('Returned data after update--------');
    console.log(JSON.stringify(data, undefined, 2));
    return prisma.query.posts(null, '{ id title body published author { id name } }')
}).then(data => {
    console.log('Verify post after update----------');
    console.log(JSON.stringify(data, undefined, 2));
});

*/



// prisma.subscription

// prisma.exists (util methods)

export default prisma;