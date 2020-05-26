// test data for users
// demo user data

let Users = [
    { id: '1', name: "John Doe", email: "john.doe@example.com", age: 27 },
    { id: '2', name: "Jane Doe", email: "jane.doe@example.com", age: 22 },
    { id: '3', name: "Mike Tally", email: "miket@example.com", age: 21 },
    { id: '4', name: "Jim Luper", email: "jimluper@gmail.com", age: 55 },
    { id: '5', name: "John Smitty", email: "john.smitty@yahoo.com", age: 39 },
    { id: '6', name: "Brian Beaver", email: "brian.beaver@beavermech.com", age: 59 },
    { id: '7', name: "Marty McFly", email: "marty@backtothefuture.com", age: 50 }
];

let Posts = [
    { id: '1', title: 'GraphQL 101', body: 'Entry level course on how to use GraphQL/Prisma', published: true, author: '1' },
    { id: '2', title: 'C# 101', body: 'Entry level course on how to use C# and Visual Studio Code', published: true, author: '1' },
    { id: '3', title: 'VB.Net 101', body: 'Entry level course on how to use Visual Basic with Visual Studio 2019', published: true, author: '2' },
    { id: '4', title: 'Javascript ES2015 ', body: 'Entry level course on Javascript - it\'s history and usage', published: true, author: '2' },
    { id: '5', title: 'Typescript 101', body: 'Entry level course on Typescript and how it evolved from the issues inherit in Javascript.', published: true, author: '3' },
    { id: '6', title: 'SQL Server 101 with Microsoft SQL Server/2017', body: 'Entry level course on using Microsofts premier database.', published: true, author: '4' },
    { id: '7', title: 'GraphQL 201', body: 'Advanced course on using GraphQL with Prisma and Apollo', published: false, author: '5' },
    { id: '8', title: 'Delete Data Using Mutation', body: 'Example of how to delete data using GraphQL', published: true, author: '1' }

];

let Comments = [
    { id: "a1", commentText: "Comment for a1", author: '1', post: '1' },
    { id: "b2", commentText: "Comment for b2", author: '2', post: '4' },
    { id: "c3", commentText: "Comment for c3", author: '1', post: '2' },
    { id: "d4", commentText: "Comment for d4", author: '4', post: '2' },
    { id: "e5", commentText: "Comment for e5", author: '5', post: '5' },
    { id: "f6", commentText: "Comment for f6", author: '4', post: '1' },
    { id: "g7", commentText: "Comment for g7", author: '7', post: '3' },
    { id: "h8", commentText: "Comment for h8", author: '6', post: '2' },
    { id: "i1", commentText: "Comment for i1", author: '3', post: '1' },
    { id: "i2", commentText: "Comment for i2", author: '1', post: '6' },
    { id: "j1", commentText: "Comment for j1", author: '1', post: '8' },
    { id: "k1", commentText: "Comment for k1", author: '1', post: '8' }
];

const db = {
    Users,
    Posts,
    Comments
}

export default db;

