import getUserId from '../utils/getUserId';
const Subscription = {
    count: {
        subscribe(parent, args, context, info) {
            const { pubsub } = context;
            let count = 0;

            const channelName = 'count';
            const intervalMilliseconds = 1000;

            setInterval(() => {
                count++;
                pubsub.publish(channelName, { count });
            }, intervalMilliseconds);

            // channelName
            return pubsub.asyncIterator(channelName);
        }
    },
    comment: {
        subscribe(root, args, context, info) {
            const { prisma } = context;
            const { postID } = args;

            // workflow:
            // prisma --> node --> client (graphql playground)

            return prisma.subscription.comment(
                {
                    where: {
                        node: {
                            post: {
                                id: postID
                            }
                        }
                    }
                },
                info);
            // const { postID } = args;
            // const { db, pubsub } = context;
            // //console.log('trying to find post with id:', postID);
            // //console.log(db.Posts);
            // //console.log(db.Posts.find(i => i.id === '1'));
            // const post = db.Posts.find(p => p.id === postID && p.published === true)
            // //console.log('Found post object:', post)
            // if (!post) {
            //     throw new Error("Post not found.");
            // }
            // return pubsub.asyncIterator(`comment ${postID}`);
        }
    },
    post: {
        subscribe(root, args, context, info) {
            // destructure objects needed
            const { prisma } = context;

            return prisma.subscription.post(
                {
                    where:
                    {
                        node: {
                            published: true
                        }
                    }
                },
                info
            );


            // //const { postID } = args;
            // //const post = db.Posts.find(p => p.id === postID && p.published);
            // //if (!post) return;
            // return pubsub.asyncIterator('post');

        }
    },
    mypost: {
        subscribe(root, args, context, info) {
            const { prisma, request } = context;
            const userID = getUserId(request);
            return prisma.subscription.post({
                where: {
                    node: {
                        author: { id: userID }
                    }
                }
            }, info);
        }
    },
    user: {
        subscribe(root, args, context, info) {
            // destructure objects needed
            const { prisma } = context;

            return prisma.subscription.user(null, info);

            // //const { postID } = args;
            // //const post = db.Posts.find(p => p.id === postID && p.published);
            // //if (!post) return;
            // return pubsub.asyncIterator('post');

        }
    }
}

export default Subscription;