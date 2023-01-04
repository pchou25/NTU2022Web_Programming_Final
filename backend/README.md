# Backend

## Useful links

1. <https://stackoverflow.com/questions/54983080/return-file-from-graphql-resolve>
1. <https://stackoverflow.com/questions/23114374/file-uploading-with-express-4-0-req-files-undefined>
1. <https://levelup.gitconnected.com/how-to-add-file-upload-to-your-graphql-api-34d51e341f38>
1. <https://www.youtube.com/watch?v=bLQqkeVT7os>
1. <https://the-guild.dev/graphql/yoga-server/docs/features/file-uploads>

## Notes on GraphQL

1. <https://stackoverflow.com/questions/44344560/context-vs-rootvalue-in-apollo-graphql>
    - `RootValue` is an initial value passed in to the entry point of a query. Its undefined by default, but Apollo allows you to seed the query with some values if thats appropriate for your use case. It's accessible as the first parameter in the resolver function signature.
    - `context` is a shared reference available to all resolvers. Typically its an object of key/val pairs containing handles to stateful external connections or meta concerns like users/auth/etc.
    - Clients can only read what you return from resolvers; context is not represented in the introspection query. It's safe to put sensitive data and connectors (in the Apollo paradigm) there if your resolvers need access to fulfill their responsibilities.
