import { createServer } from 'http'
import { createPubSub, createSchema, createYoga } from "graphql-yoga";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { GraphQLError } from 'graphql';

import express from 'express';
import path from "path";
import * as fs from "fs";

import secretHash from './crypto';
import mongo from "./db/mongo";
import DepotModel from "./db/models/depot";
import getDepot from './graphql/resolvers/getDepot';
import uploadFile from './graphql/resolvers/uploadFile';
import deleteFile from './graphql/resolvers/deleteFile';
import subscribeDepot from './graphql/resolvers/subscribeDepot';
import daemon from './daemon';

mongo.connect();

const ipHistory = {};
const maxCon = 1000;
setInterval(() => {
    for (var k in ipHistory) {
        delete ipHistory[k];
    }
}, 1000 * 60 * 60 * 24);


const port = process.env.PORT || 8763;
const app = express();
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend", "build")));
    app.get("/*", function (req, res) {
        const ip = req.ip || req.socket.remoteAddress;
        if (!(ip in ipHistory)) {
            ipHistory[ip] = 0;
        }
        ipHistory[ip] += 1;
        if (ipHistory[ip] > maxCon) {
            res.end(); // exit if it is a black listed ip
        }
        res.sendFile(path.join(__dirname, "../frontend", "build", "index.html"));
    });
}

app.get('/download', function (req, res) {
    const file = `${__dirname}/files/${req.query.filename}`;
    res.download(file, req.query.as ? req.query.as : 'file.tmp'); // Set disposition and send it.
});

const pubsub = createPubSub();
const yoga = createYoga({
    schema: createSchema({
        typeDefs: fs.readFileSync("./src/graphql/schema.graphql", "utf-8"), // Relative to folder backend/
        resolvers: {
            Query: {
                getDepot,
            },
            Mutation: {
                deleteFile,
                uploadFile,
            },
            Subscription: {
                subscribeDepot,
            },
        },
    }),
    context: {
        GraphQLError,
        DepotModel,
        pubsub,
        secretHash,
    },
    graphql: {
        subscriptionsProtocol: "WS",
    },
    graphqlEndpoint: "/graphql",
});

app.use('/graphql', yoga);

/* Handle Subscription */
const httpServer = createServer(app);
const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/subscriptions',
});

useServer(
    {
        execute: (args) => args.rootValue.execute(args),
        subscribe: (args) => args.rootValue.subscribe(args),
        onSubscribe: async (ctx, msg) => {
            const { schema, execute, subscribe, contextFactory, parse, validate } =
                yoga.getEnveloped({
                    ...ctx,
                    req: ctx.extra.request,
                    socket: ctx.extra.socket,
                    params: msg.payload,
                });
            const args = {
                schema,
                operationName: msg.payload.operationName,
                document: parse(msg.payload.query),
                variableValues: msg.payload.variables,
                contextValue: await contextFactory(),
                rootValue: {
                    execute,
                    subscribe,
                },
            };
            const errors = validate(args.schema, args.document);
            if (errors.length) return errors;
            return args;
        },
    },
    wsServer
);

httpServer.listen(port, () => {
    console.log(`App listening on port ${port}`);
    daemon(pubsub, DepotModel);
});
