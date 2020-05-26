const Comment = {

    // author(root, args, context, info) {
    //     const { db } = context;
    //     //console.log(root, args);
    //     const author = db.Users.find(user => user.id === root.author);
    //     return author;
    // },
    // post(root, args, context, info) {
    //     const { db } = context;
    //     // root is an instance of comment
    //     // root.post is the numeric id for the 
    //     // post associated with this comment.
    //     console.log('Comment:Post => ', root);
    //     console.log('Comment:Post:Args => ', args);
    //     return db.Posts.find(p => p.id === root.post);
    // }
};

export default Comment;
