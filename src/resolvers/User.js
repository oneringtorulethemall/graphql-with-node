import getUserID from '../utils/getUserId';
const User = {

    email: {
        fragment: 'fragment userID on User { id } ',
        // setup resolver function for email
        // use this approach to hide specific data elements
        // based on some condition (authentication)
        resolve(parent, args, context, info) {
            // parent is the User object instance
            const { prisma, request } = context;
            const userID = getUserID(request, false);
            //console.log("Parent ID: ", parent.id);
            //console.log("userID: ", userID);
            if (userID && userID === parent.id)
                return parent.email;
            return null;
        }
    },
    posts: {
        fragment: "fragment userID on User { id }",
        resolve(parent, args, context, info) {
            const { prisma, request } = context;
            const userID = getUserID(request, true);
            //console.log("Parent ID: ", parent.id);
            //console.log("userID: ", userID);

            return prisma.query.posts({
                where: {
                    published: true,
                    author: {
                        id: parent.id
                    }
                }
            });

        }
    }


    // posts(root, args, context, info) {
    //     // root will be an instance of "user"
    //     // we can get any of the properties
    //     // defined on user within this method.
    //     const { db } = context;
    //     console.log(root, args);
    //     const filteredPost = db.Posts.filter(post => {
    //         return (post.author === root.id)
    //     });
    //     return filteredPost;
    // },
    // comments(root, args, context, info) {
    //     const { db } = context;
    //     const filteredComments = db.Comments.filter(comment => {
    //         // root refers to User
    //         // comment.author refers to the author of the comment
    //         return (comment.author === root.id)
    //     });
    //     return filteredComments;
    // }
};

export default User;

