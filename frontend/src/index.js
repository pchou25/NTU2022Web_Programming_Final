import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    ApolloClient, InMemoryCache, ApolloProvider, split, HttpLink,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import App from './App';
import hostinfo from './backendhost.json';

const httpLink = new HttpLink({
    uri: `http://${hostinfo.host}:${hostinfo.port}/graphql`,
});

const wsLink = new GraphQLWsLink(createClient({
    url: `ws://${hostinfo.host}:${hostinfo.port}/subscriptions`,
}));

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition'
            && definition.operation === 'subscription'
        );
    },
    wsLink,
    httpLink,
);

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>,
);
