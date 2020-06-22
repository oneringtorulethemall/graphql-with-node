import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedDatabase, { authenticationInfo, postInfo } from './utils/seedDatabase';
import { getClient } from './utils/getClient';
import {
    getPost, getPosts, getMyPosts,
    createPost, updatePost, deletePost, subscribeToPosts

} from './utils/operations';

const client = getClient();

beforeEach(seedDatabase);

test('Should get list of public post', async () => {
    const response = await client.query({ query: getPosts });
    expect(response.data.posts.length).toBeGreaterThanOrEqual(1);

    console.log("posts list");
    console.log(response.data.posts);

    expect(response.data.posts[0].published).toBe(true);
});


test('Should get a list of posts for authenticated user', async () => {
    const client = getClient(authenticationInfo.user1.jwt);

    const results = await client.query({
        query: getMyPosts
    });
    console.log(results.data);
    expect(results.data.myposts.length).toBeGreaterThanOrEqual(2);
    expect(results.data.myposts[0].published).toBe(true);
    expect(results.data.myposts[1].published).toBe(false);
    expect(results.data.myposts[0].author.id).toBe(authenticationInfo.user1.user.id);

});


test('Should be able to update my post', async () => {
    const client = getClient(authenticationInfo.user1.jwt);

    const variables = {
        id: postInfo.post1.id,
        data: {
            published: false
        }
    };
    const id = `${postInfo.post1.id}`;
    // console.log('id is: ' + id);
    const response = await client.mutate({
        mutation: updatePost,
        variables
    });

    expect(response.data.updatePost.published).toBe(false);

    const readResponse = await client.query({
        query: getPost,
        variables: { id }
    });
    console.log(readResponse);

    expect(readResponse.data.post.published).toBe(false);

    // search for the ID with a published property set to FALSE
    const shouldExists = await prisma.exists.Post({ id, published: false });
    expect(shouldExists).toBe(true);


});

test('Should create a new post', async () => {
    const client = getClient(authenticationInfo.user1.jwt);

    const variables = {
        data: {
            title: "Predator - Famous Quote",
            body: "Come here! Shhh. Look up, in those trees. See it?",
            published: true
        }
    }
    const response = await client.mutate({
        mutation: createPost,
        variables
    });
    console.log(response);

    // this is not working...Why ?!
    /// const newPost = await prisma.query.post({ id: response.data.createPost.id }, null);
    /// console.log(newPost);

    const resp2 = await client.query({
        query: getPost,
        variables: { id: response.data.createPost.id }
    });

    expect(resp2.data.post.id).toBe(response.data.createPost.id);
    expect(resp2.data.post.title).toBe(response.data.createPost.title);
    expect(resp2.data.post.body).toBe(response.data.createPost.body);

});


test('Should delete post', async () => {
    const client = getClient(authenticationInfo.user1.jwt);

    const { data } = await client.mutate(
        {
            mutation: deletePost,
            variables: { id: postInfo.post2.id }
        }
    );
    expect(data.deletePost.id).toBe(postInfo.post2.id);
    const exists = await prisma.exists.Post({ id: postInfo.post2.id });
    expect(exists).toBe(false);
});

test('Should notify if a POST is deleted.', async (done) => {

    const client = getClient(authenticationInfo.user1.jwt);
    client.subscribe(
        { query: subscribeToPosts })
        .subscribe({
            next(response) {
                // assertions
                // intentionally generate error : expect(1).toBe(2);
                console.log("NEXT | response info");
                console.log(response);
                //expect(response.data.post.id).toBe(postInfo.post1.id);
                expect(response.data.post.mutation).toBe('DELETED');
                done();
            }
        });
    // delete POST
    const rc = await prisma.mutation.deletePost(
        {
            where: { id: postInfo.post1.id }
        }
    );
    console.log('return from deletePost call:');
    console.log(rc);

});
