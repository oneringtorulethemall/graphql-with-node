import { getFirstName, isValidPassword } from '../src/utils/user';
import 'cross-fetch/polyfill';
import prisma from '../src/prisma';
import seedDatabase, { authenticationInfo } from './utils/seedDatabase';
import { getClient } from './utils/getClient';
import { getUsers, getProfile, login, createUser } from './utils/operations';

// default: non authenticated client
const client = getClient();



// built in jest method
// that will add seed data
beforeEach(seedDatabase);


test('Should create a new user', async () => {

    const variables = {
        data: {
            name: "Moses Malone",
            email: "moses.malone@nbatv.com",
            password: "Mypass123!"
        }
    }


    const response = await client.mutate({
        mutation: createUser,
        variables // auto es6 shorthand
    });
    // response.data.createUser.user.id is the unique
    // guid returned for the user.
    expect(response.data.createUser.user.name).toBe(variables.data.name);

    const searchFor = response.data.createUser.user.id;

    const userExist = await prisma.exists.User({ id: searchFor });
    expect(userExist).toBe(true)


});

test('Should expose public author profiles', async () => {

    const response = await client.query({ query: getUsers });
    expect(response.data.users.length).toBeGreaterThanOrEqual(1);
    expect(response.data.users[0].email).toBe(null);
    expect(response.data.users[0].name).toBe("Swaz");

});

test('Should fetch logged in user profile', async () => {
    const client = getClient(authenticationInfo.user1.jwt);
    const results = await client.query({
        query: getProfile
    });
    //console.log('data object is:');
    //console.log(results.data);
    //console.log('data.me is:');
    //console.log(results.data.me);
    expect(results.data.me.id).toBe(authenticationInfo.user1.user.id)
    expect(results.data.me.email).toBe(authenticationInfo.user1.user.email);

});

test('Should fail with bad credentials', async () => {

    const variables = {
        data: {
            email: 'swaz@gmail.com',
            password: 'Abcd1234$$'
        }
    }

    await expect(
        client.mutate({ mutation: login, variables })
    ).rejects.toThrow();

});

test('Should fail to create user because of password length', async () => {

    const variables = {
        data: {
            name: "Failed User",
            email: "userabc@baddomain.com",
            password: "abc123"
        }
    }

    await expect(
        client.mutate({ mutation: createUser, variables })
    ).rejects.toThrow();


});

/*
test('Should return first name even if full name only contains first name', () => {
    const firstName = getFirstName('Jerry');
    expect(firstName).toBe('Jerry');
});
*/

/*
test('Should return first name from full name', () => {
    const firstName = getFirstName('John Q Public');
    expect(firstName).toBe("John");
});
*/

test('Should meet minimum length requirement', () => {
    const isValid = isValidPassword('abc123');
    expect(isValid).toBe(false);
});

/*
test('Should not contain literal password anywhere in password', () => {
    const isValid = isValidPassword('MYpassword');
    expect(isValid).toBe(false);
});
*/

test('Should validate a correctly formatted password', () => {
    const isValid = isValidPassword("Ab1254THR29");
    expect(isValid).toBe(true);
});
