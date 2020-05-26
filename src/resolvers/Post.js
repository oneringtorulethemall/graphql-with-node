const Post = {
    
    // format to use when using arrays and/or
    // specific searching
    // Prisma can automatically detect
    // relationships and return the correct
    // navigation properties.
    // author(root, args, context, info) {
    //     console.log(root.author);
    //     const { db } = context;
    //     // root refers to the parent of author (Post)
    //     return db.Users.find(user => user.id === root.author);
    //     // author is the 'id' in the post object
    // },
    // comments(root, args, context, info) {
    //     const { db } = context;
    //     // return any comments associated with this post.
    //     // root is an instance of Post
    //     const commentList = db.Comments.filter(comment => {
    //         // comment.post will refer to the id field
    //         // in the comments array that associates a
    //         // comment with a given post.
    //         return comment.post === root.id;
    //     });
    //     return commentList;
    // }
};

export default Post;


