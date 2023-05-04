// const db = require("./db2");
import {db} from "./db2.js";
import {resolvers} from "./resolvers2.js";
import { ApolloServer } from "apollo-server";
import {typeDefs}  from "./schema.js";

// TODO set up resolvers and type definitions

const setupServer = async () => {
    await db.initialize();

    const server = new ApolloServer({
        resolvers,
        typeDefs,
        dataSources: () => ({
            db,
        }),
    });
    
    const {url} = await server.listen({port:9000});
    
    return console.log(`Server running on port ${url}`);
};

await setupServer();

// module.exports = setupServer;
