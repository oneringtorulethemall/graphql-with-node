import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getUserId from '../utils/getUserId';
import { generateJWT } from '../utils/generateJWT';
import hashPassword from '../utils/hashPassword';

/*
const token = jwt.sign({
    id: 46
}, 'thegreatestsecret');
console.log('JWT');
console.log(token);

const decodedValue = jwt.decode(token);
console.log("JWT-Decoded");
console.log(decodedValue);

const verifiedValue = jwt.verify(token, 'thegreatestsecret');
console.log("Verified");
console.log(verifiedValue);
*/


/* mutation section */

const Mutation = {
    createUser: async (root, args, context, info) => {
        const { prisma } = context;
        const { name, email, password } = args.data;

        const hashedPassword = await hashPassword(password);

        const emailTaken = await prisma.exists.User({ email });
        if (emailTaken) {
            throw new Error('Email address is already in use.');
        }
        const user = await prisma.mutation.createUser({
            data: {
                name,
                email,
                password: hashedPassword
            }
        } /*, info */);

        return {
            user,
            token: generateJWT(user.id)
        }
    },
    deleteUser: async (root, args, context, info) => {
        const { db, prisma } = context;
        const { id } = args;

        const userExists = await prisma.exists.User({ id })
        if (!userExists) {
            throw new Error("User not found.");
        }

        // @relation directive will take care of
        // cleaning up post/comments associated with this
        // user
        var deletedUser = await prisma.mutation.deleteUser({
            where: { id }
        }, info);

        return deletedUser;
        // const foundUserIndex = db.Users.findIndex(u => u.id === args.id);
        // if (foundUserIndex < 0) {
        //     throw new Error("Unable to locate user.");
        // }

        // 1st arg: index of start delete
        // 2nd arg: number to remove from foundUserIndex position
        // deletedUsers is an array of items that were deleted
        // in this case, it will be an array of a single element.
        //const deletedUsers = db.Users.splice(foundUserIndex, 1);

        // find all post for the deleted user and remove
        //db.Posts = db.Posts.filter(post => { post.author !== args.id });

        // find all comments for the deleted users and remove
        // db.Comments = db.Comments.filter(comment => {
        //     return comment.author !== args.id
        // });
        //return deletedUsers[0];
    },

    async updateSpecificUser(root, args, context, info) {

        const { prisma, request } = context;
        const { data, id } = args;

        if (data.password !== undefined && data.password !== "") {
            // user is updating their password
            console.log("Updating pwd");
            const pwd = hashPassword(data.password, 10);
            data.password = pwd;
        }

        return prisma.mutation.updateUser({
            where: { id },
            data
        }, info)



    },

    updateUser: async (root, args, context, info) => {
        const { prisma, request } = context;
        const { data } = args;
        const id = getUserId(request);
        // const { id, data } = args;

        if (!id) {
            throw new Error("Invalid request. Unable to continue.")
        }

        // could use:
        // var user = await.prism.mutation.updateUser

        if (data.password !== undefined && data.password !== "") {
            // user is updating their password
            console.log("Updating pwd");
            const pwd = await hashPassword(data.password);
            data.password = pwd;
        }

        return prisma.mutation.updateUser({
            where: { id },
            data
        }, info)

        // const user = db.Users.find(u => u.id === id);
        // if (!user) {
        //     throw new Error("Unable to locate user. Unable to continue.");
        // }

        // console.log(typeof data.email);
        // if (typeof data.email === 'string') {
        //     const emailTaken = db.Users.some(usr => usr.email === data.email && usr.id !== id);
        //     console.log('emailTaken: ', emailTaken);
        //     if (emailTaken) {
        //         throw new Error("Unable to update user email. New email address for user is already in use.");
        //     }
        //     // update email property
        //     user.email = data.email;
        // }
        // if (typeof data.name === 'string') {
        //     if (data.name === '') {
        //         throw new Error("Unable to update. Name is required.");
        //     }
        //     user.name = data.name;
        // }
        // if (typeof data.age !== 'undefined') {
        //     user.age = data.age;
        // }
        // return user;
    },
    login: async (root, args, context, info) => {
        const { email, password } = args.data;
        const { prisma } = context;

        const user = await prisma.query.user({
            where: { email }
        });
        if (!user) {
            throw new Error("ER9010U: Unable to authenticate.");
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error("ER901P: Unable to authenticate.")
        }
        return {
            user,
            token: generateJWT(user.id)
        }
    },


    createPost: async (root, args, context, info) => {
        const { prisma, request } = context;
        const userID = getUserId(request);

        console.log(args.data);

        return prisma.mutation.createPost(
            {
                data: {
                    title: args.data.title,
                    body: args.data.body,
                    published: args.data.published,
                    author: {
                        connect: { id: userID }
                    }
                }
            },
            info
        );


        // var match = db.Users.findIndex(u => u.id === args.data.author);
        // if (match < 0) { throw new Error("Invalid data: createPost"); }

        // const post = {
        //     id: uuidv4(),
        //     ...args.data
        //     //title: args.title,
        //     //body: args.body,
        //     //published: args.published,
        //     //author: user.id
        // };
        //console.log('Post object:\n', post);

        // db.Posts.push(post);
        // if (post.published) {
        //     pubsub.publish('post',
        //         {
        //             post: {
        //                 mutation: "CREATED",
        //                 data: post
        //             }
        //         });
        // }
        // return post;
    },

    deletePost: async (root, args, context, info) => {
        const { prisma, request } = context;
        const { id } = args;
        const userID = getUserId(request);
        console.log('deletePost: [' + id + ']');
        // find all comments related to this post
        // and remove the comments associated with this post
        // now, remove the post

        const postExists = await prisma.exists.Post({
            id,
            author: { id: userID }
        });
        if (!postExists) {
            throw new Error("Unable to delete post.")
        }
        return prisma.mutation.deletePost({
            where: { id }
        }, info);

        // const postIndex = db.Posts.findIndex(p => p.id == postID);
        // if (postIndex < 0) {
        //     throw new Error("Unable to locate post entry");
        // }
        // console.log('postIndex: [' + postIndex + ']');
        // db.Comments = db.Comments.filter(comment => {
        //     return comment.post !== postID
        // });
        // use destructured array and name the
        // 1st entry...any remaining are tossed (which there should not be any)
        // const [deletedPost] = db.Posts.splice(postIndex, 1);
        // if (deletedPost.published) {
        //     pubsub.publish('post', {
        //         post: {
        //             mutation: 'DELETED',
        //             data: deletedPost
        //         }
        //     });
        // }
        // return deletedPost;

    },

    updatePost: async (root, args, context, info) => {
        const { data, id } = args;
        const { prisma, request } = context;
        const userID = getUserId(request);

        console.log("ID: ", id)
        console.log("Data: ", data);

        const postExists = await prisma.exists.Post({
            id,
            author: { id: userID }
        });
        if (!postExists) {
            throw new Error("Unable to update post.")
        }

        const isPublished = await prisma.exists.Post({
            id,
            published: true
        });

        // const post = db.Posts.find(p => p.id === id);
        // if (!post) {
        //     throw new Error("Unable to locate post.");
        // }


        // if the current post is (Published==true) and the
        // data coming in (Published==false), then
        // delete all of the comments for the post.

        if (isPublished) {
            if (data.published && data.published === false) {
                // remove all current comments for this post.
                await prisma.mutation.deleteManyComments({
                    where: {
                        post: { id }
                    }
                })
            }
        }

        // returns a promise...but, could easily do
        // var rc = await prisma.mutation.updatePost(...)
        // return rc 
        return prisma.mutation.updatePost({
            data: {
                title: data.title,
                body: data.body,
                published: data.published
            },
            where: {
                id
            }
        })


        // need to add validation rule to prevent
        // empty title/body values.
        // if (typeof data.body === 'string')
        //     post.body = data.body;

        // if (typeof data.title === 'string')
        //     post.title = data.title;

        // if (typeof data.published === 'boolean') {
        //     post.published = data.published;
        //     if (originalPost.published && !post.published) {
        //         // deleted
        //         pubsub.publish('post', {
        //             post: {
        //                 mutation: 'DELETED',
        //                 data: originalPost
        //             }
        //         });
        //     } else {
        //         if (!originalPost.published && post.published) {
        //             // created
        //             pubsub.publish('post', {
        //                 post: {
        //                     mutation: 'CREATED',
        //                     data: post
        //                 }
        //             });
        //         }
        //     }
        // }
        // else {
        //     if (post.published) {
        //         pubsub.publish('post', {
        //             post: {
        //                 mutation: 'UPDATED',
        //                 data: post
        //             }
        //         })
        //     }
        // }
        // return post;
    },

    createComment: async (root, args, context, info) => {
        const { prisma, request } = context;
        const userID = getUserId(request);

        const postExist = await prisma.exists.Post({
            id: args.data.post,
            published: true
        });

        if (!postExist) {
            throw new Error("Unable to locate published post.");
        }

        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: userID
                    }
                },
                post: {
                    connect: { id: args.data.post }
                }
            }
        }, info);

        // const userFound = db.Users.findIndex(u => u.id === args.data.author);
        // if (userFound < 0) throw new Error("Invalid data: createComment/user");
        // const postFound = db.Posts.find(p => p.id === args.data.post);
        // if (!postFound) throw new Error("Invalid data: createComment/post")
        // if (!postFound.published) throw new Error("Invalid data: createComment|Post has not been published");
        // const comment = {
        //     id: uuidv4(),
        //     ...args.data
        // }
        // db.Comments.push(comment);
        // // post: == id of the Post
        // pubsub.publish(`comment ${args.data.post}`, {
        //     comment: {
        //         mutation: 'CREATED',
        //         data: comment
        //     }
        // });
        // return comment;
    },

    deleteComment: async (root, args, context, info) => {
        // destructure ref to db from context object;
        const { prisma, request } = context;
        const commentID = args.id;
        const userID = getUserId(request);

        const cmntExists = await prisma.exists.Comment({
            id: commentID,
            author: { id: userID }
        });
        if (!cmntExists) {
            throw new Error("Unable to delete comment.")
        }

        return prisma.mutation.deleteComment({
            where: { id: commentID }
        }, info);


        // const commentIndex = db.Comments.findIndex(cmt => cmt.id === commentID);
        // if (commentIndex < 0) {
        //     throw new Error(`Unable to locate comment with this id:[${commentID}]`);
        // }
        // destructure returned array
        // just getting the very 1st entry
        // const [deletedComment] = db.Comments.splice(commentIndex, 1);

        // pubsub.publish(`comment ${deletedComment.post}`, {
        //     comment: {
        //         mutation: 'DELETED',
        //         data: deletedComment
        //     }
        // }
        // );
        // return deletedComment;
    },

    updateComment: async (root, args, context, info) => {
        const { id, data } = args;
        const { prisma, request } = context;
        const userID = getUserId(request);

        const cmntExists = await prisma.exists.Comment({
            id: id,
            author: { id: userID }
        });
        if (!cmntExists) {
            throw new Error("Unable to update comment.")
        }

        return prisma.mutation.updateComment({
            where: { id },
            data: { ...data }
        }, info);

        // const comment = db.Comments.find(c => c.id === id);
        // if (!comment) {
        //     throw new Error("Unable to locate comment.");
        // }
        // comment.commentText = data.commentText;

        // pubsub.publish(`comment ${args.data.post}`,
        //     {
        //         comment: {
        //             mutation: 'UPDATED',
        //             data: comment
        //         }
        //     }
        // );
        // return comment;
    }
};

export default Mutation;
