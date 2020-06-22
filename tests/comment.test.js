import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedDatabase, { authenticationInfo, postInfo, commentInfo } from './utils/seedDatabase';
import { getClient } from './utils/getClient';
import { getComments, deleteComment, subscribeToComments } from './utils/operations';
import { assertAbstractType } from 'graphql';

const client = getClient();

beforeEach(seedDatabase);

test('Should get list of all comments', async () => {

    const response = await client.query({
        query: getComments
    });

    console.log(response.data);


});


test('Should delete comment that logged in user owns', async () => {
    const client = getClient(authenticationInfo.user1.jwt);

    const variables = { id: commentInfo.comment1.id };

    const response = await client.mutate(
        {
            mutation: deleteComment,
            variables
        }
    );
    expect(response.data.deleteComment.id).toBe(commentInfo.comment1.id);
    const exists = await prisma.exists.Comment({ id: commentInfo.comment1.id });
    expect(exists).toBe(false);

});



test('Should fail to delete comment that logged in user DOES NOT own', async () => {

    const client = getClient(authenticationInfo.user1.jwt);

    const variables = { id: commentInfo.comment2.id };

    await expect(client.mutate({
        mutation: deleteComment,
        variables
    })).rejects.toThrow();

});

test('Should subscribe to comments for a post', async (done) => {
    // NOTE: done is a callback that can be used to 
    //       tell Jest that the method has indeed 
    //       completed. Otherwise, it will show success
    //       before the async method has completed and 
    //       assertion has failed.
    const variables = {
        postID: postInfo.post1.id
    };

    client.subscribe({
        query: subscribeToComments,
        variables
    }).subscribe({
        next(response) {
            // assertions
            // intentionally generate error : expect(1).toBe(2);
            expect(response.data.comment.mutation).toBe('DELETED');
            done();
        }
    })


    // change comments
    const rc = await prisma.mutation.deleteComment(
        {
            where: { id: commentInfo.comment1.id }
        }
    );
    console.log('return from deleteComment call:');
    console.log(rc);

});