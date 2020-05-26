import getUserId from "../utils/getUserId";

const Query = {
    me(root, args, context, info) {
        // destructure to get object
        // of interest.
        const { prisma, request } = context;
        const userID = getUserId(request, true);
        if (!userID) {
            throw new Error('Not logged in.');
        }
        return prisma.query.user({
            where: { id: userID }
        }, info);
        //const { db, prisma } = context;
        //return db.Users.find(user => user.id === '1')
    },
    post: async (root, args, context, info) => {
        const { prisma, request } = context;
        const { id } = args;
        const userID = getUserId(request, true);
        console.log('id:', id);
        console.log('userID: ', userID)
        const opArgs = {};

        const posts = await prisma.query.posts({
            where: {
                id,
                OR: [{
                    published: true
                }, {
                    author: {
                        id: userID
                    }
                }
                ]
            }
        });
        if (posts.length < 1) { throw new Error('Post not found.') }
        return posts[0];

        //        opArgs.where = {
        //            id
        //        };
        //        return prisma.query.post(opArgs, info);

        // let rc = null;
        // if (id) {
        //     rc = db.Posts.find(i => i.id === id);
        // }
        // return rc;
    },
    posts(root, args, context, info) {
        const { prisma } = context;
        const { query, first, skip, after, orderBy } = args;
        const opArgs = {
            first,
            skip,
            after,
            orderBy,
            where: { published: true }
        };
        if (query) {
            opArgs.where.OR = [{
                body_contains: query
            }, {
                title_contains: query
            }
            ]
        }
        return prisma.query.posts(opArgs, info);

        // if (!query) {
        //     return db.Posts;
        // }

        // let queryBy = query.toLowerCase();
        // const filteredPost = db.Posts.filter(p => {
        //     // check them one at a time for a match
        //     // and return if it is ever true.
        //     // this should be slightly faster since it is
        //     // checking the fields one at a time
        //     // if the 1st field checked (title) has it
        //     // then just return true and there is no need
        //     // to check body field.
        //     const titleHasQuery = p.title.toLowerCase().includes(queryBy);
        //     if (titleHasQuery) return titleHasQuery;
        //     return p.body.toLowerCase().includes(queryBy);
        // });
        // return filteredPost;
    },

    myposts: async (root, args, context, info) => {
        const { prisma, request } = context;
        const { query, first, skip, after, orderBy } = args;
        const userID = getUserId(request);
        if (!userID) {
            throw new Error("Authentication required for this functionality.");
        }

        const opArgs = {
            first,
            skip,
            after,
            orderBy,
            where: {
                author: { id: userID }
            }
        };

        if (query) {
            opArgs.where.OR = [{
                body_contains: query
            }, {
                title_contains: query
            }
            ]
        }

        return prisma.query.posts(opArgs, info);

    },


    user(root, args, context, info) {
        const { prisma } = context;
        const { id } = args;

        return prisma.query.user({
            where: { id }
        }, info);
    },

    users(root, args, context, info) {
        // ok, we have query...
        //
        // info object - contains information about the
        // request
        // use it as the second argument to the query.users
        const { prisma } = context;
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        };

        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }
                    // } , {
                    //     email_contains: args.query
                    // }
                ]
            }
        }

        return prisma.query.users(opArgs, info)

        /*
        const { query } = args;
        if (!query) {
            return db.Users;
        }
        // filter through list to check if name
        // contains the query text
        const queryBy = query.toLowerCase();
        const filteredUsers = db.Users.filter((user) => {
            return user.name.toLowerCase().includes(queryBy)
        });
        return filteredUsers;
        */
    },

    comments: (root, args, context, info) => {
        const { prisma } = context;
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        };
        if (args.query) {
            opArgs.where = {
                text_contains: args.query
            }
        }
        return prisma.query.comments(opArgs, info);
        // if (!args.query)
        //     return db.Comments;

        // const searchFor = args.query.toLowerCase();
        // const filteredResults = db.Comments.filter(comment => {
        //     return comment.commentText.toLowerCase().includes(searchFor);
        // });
        // return filteredResults;

    },

    comment: (root, args, context, info) => {
        const { prisma } = context;
        //const opArgs = { id: args.id };
        const opArgs = {};
        opArgs.where = { id: args.id };
        return prisma.query.comment(opArgs, info);
    },

    greeting: (root, args, context, info) => {
        console.log(args);
        var posMsg = args.position ? " You are my favorite " + args.position : "";
        var nameMsg = args.name ? args.name : "";
        var greetmsg = `Hello ${nameMsg} ${posMsg}`;
        if (args.name) return greetmsg;
        else return "Hello!";
    },
    add: (root, args, context, info) => {
        console.log(args);
        // be careful on using destructure...
        // do not accidentially go a level deeper than
        // necessary or you will get undefined.
        var { numbers } = args;
        console.log(numbers);
        if (!numbers || numbers.length < 1) return 0;
        var result = 0;
        result = numbers.reduce((accumulator, currentValue) => {
            return currentValue + accumulator;
        });
        return result;
    },
    grades: (root, args, context, info) => {
        return [99, 80, 93, 76, 84, 92];
    },
};

// could use
// export { Query as default }

export default Query;


