import { GraphQLServer, PubSub } from "graphql-yoga";
import { resolvers, fragmentReplacements } from './resolvers/index';

// basically causes file to run on the import
import prisma from './prisma';

// scalar types
// NOTE: an ! after any field definition forces it to be required.
// String
// Boolean
// Int
// Float (decimal points)
// ID    (used to represent unique identifiers)


const pubsub = new PubSub();


// create server

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context(request) {
        return {
            pubsub,
            prisma,
            request
        }
    },
    fragmentReplacements
    // context: {
    //   db,
    //   pubsub, // adding pub/sub object to context object
    //   prisma
    // }
});

export { server as default };
