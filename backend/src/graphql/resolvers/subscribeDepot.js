const subscribeDepot = {
    subscribe: async (
        _,
        { username, password },
        { GraphQLError, DepotModel, pubsub, secretHash }
    ) => {
        if (process.env.NODE_ENV !== "production") {
            console.log('backend/src/graphql/resolvers/subscribeDepot.js', username, password);
        }
        const hashedPassword = secretHash(username, password);

        let depot = await DepotModel.findOne({ username, password: hashedPassword });
        if (!depot)
            throw new GraphQLError('No such user!!', {
                extensions: { code: 'USER_NOT_FOUND' },
            });

        return pubsub.subscribe(`depot ${username}`);
    }
};
export default subscribeDepot;